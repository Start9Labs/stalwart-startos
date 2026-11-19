import { healthFns, T } from '@start9labs/start-sdk'
import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const httpPort = 8080
export const consolePort = 8081
// Bound by no interface, so StartOS forwards nothing to it.
export const maintenancePort = 18080
export const smtpPort = 25
export const submissionsPort = 465
export const imapsPort = 993
export const sievePort = 4190

// StartOS never lets a package claim a host port below 1025, so the mail ports
// are published on these; instructions.md tells the user which ones to map.
export const smtpExternalPort = 2525
export const submissionsExternalPort = 10465
export const imapsExternalPort = 10993
export const sieveExternalPort = 14190

export const etcDir = '/etc/stalwart'
export const dataDir = '/var/lib/stalwart'
export const webuiDir = `${dataDir}/webui`
export const stalwartUid = 2000

// Volume subdirectory holding the 0.16 store and migration state the 1.0 migration left behind.
export const legacyDir = 'v0.16'

export const recoveryAdminUser = 'stalwart-startos'
export const adminUser = 'admin'

export const mounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: 'etc',
    mountpoint: etcDir,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'main',
    subpath: 'data',
    mountpoint: dataDir,
    readonly: false,
  })

export const getStalwartSub = (effects: T.Effects, name: string) =>
  sdk.SubContainer.of(effects, { imageId: 'stalwart' }, mounts, name)

export const chownCommand = [
  'sh',
  '-c',
  `mkdir -p ${webuiDir} && chown -R ${stalwartUid}:${stalwartUid} ${etcDir} ${dataDir}`,
] as const satisfies [string, ...string[]]

export async function checkLive(
  port = httpPort,
): Promise<healthFns.HealthCheckResult> {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/healthz/live`, {
      signal: AbortSignal.timeout(5_000),
    })
    if (res.ok) return { result: 'success', message: i18n('Stalwart is ready') }
  } catch {}
  return { result: 'failure', message: i18n('Stalwart is not ready') }
}

const phcBase64 = (b: Buffer) => b.toString('base64').replace(/=+$/, '')

export function hashPassword(password: string, rounds = 600_000) {
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, rounds, 32, 'sha256')
  return `$pbkdf2-sha256$i=${rounds},l=32$${phcBase64(salt)}$${phcBase64(hash)}`
}

type JmapCall = [string, Record<string, unknown>, string]

// `credentials` is `user:password`.
export type Api = { port: number; credentials: string }

export async function jmap(
  { port, credentials }: Api,
  methodCalls: JmapCall[],
): Promise<JmapCall[]> {
  const res = await fetch(`http://127.0.0.1:${port}/jmap/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      using: ['urn:ietf:params:jmap:core', 'urn:stalwart:jmap'],
      methodCalls,
    }),
  })
  if (res.status === 401) throw new Error(i18n('Incorrect password'))
  if (!res.ok) throw new Error(`JMAP request failed: ${res.status}`)
  const { methodResponses } = (await res.json()) as {
    methodResponses: JmapCall[]
  }
  for (const [name, args] of methodResponses) {
    const failed =
      name === 'error' ||
      Object.keys(args).some(
        (k) => k.startsWith('not') && Object.keys(args[k] as object).length,
      )
    if (failed) throw new Error(`JMAP ${name}: ${JSON.stringify(args)}`)
  }
  return methodResponses
}

// A `properties` list drops the `@type` discriminator, so variant objects are fetched whole.
export async function jmapQuery<A>(
  api: Api,
  type: string,
  properties?: string[],
): Promise<A[]> {
  const [, [, { list }]] = await jmap(api, [
    [`x:${type}/query`, { filter: {} }, 'q'],
    [
      `x:${type}/get`,
      {
        '#ids': { resultOf: 'q', name: `x:${type}/query`, path: '/ids' },
        ...(properties && { properties }),
      },
      'g',
    ],
  ])
  return list as A[]
}

type Certificate = {
  subjectAlternativeNames: Record<string, true>
  notValidAfter: string
}
type Domain = {
  id: string
  name: string
  certificateManagement: { '@type': string }
}
export async function armAcme(api: Api, hostname: string, domain: string) {
  const now = new Date()
  const certs = await jmapQuery<Certificate>(api, 'Certificate', [
    'subjectAlternativeNames',
    'notValidAfter',
  ])
  if (
    certs.some(
      (c) =>
        c.subjectAlternativeNames[hostname] && new Date(c.notValidAfter) > now,
    )
  ) {
    return
  }
  const mailDomain = (
    await jmapQuery<Domain>(api, 'Domain', ['name', 'certificateManagement'])
  ).find((d) => d.name === domain)
  if (mailDomain?.certificateManagement['@type'] !== 'Automatic') return

  await jmap(api, [
    [
      'x:Task/set',
      {
        create: {
          renew: {
            '@type': 'AcmeRenewal',
            domainId: mailDomain.id,
            status: { '@type': 'Pending', due: now.toISOString() },
          },
        },
      },
      'c1',
    ],
  ])
}

export const consoleClientId = 'startos-webui'

const consoleListener = 'console'

// Stalwart opens a new listener only on its next normal start.
export async function separateConsoleListener(api: Api) {
  const listeners = await jmapQuery<{ name: string }>(api, 'NetworkListener', [
    'name',
  ])
  await jmap(api, [
    [
      'x:Http/set',
      {
        update: {
          singleton: {
            allowedEndpoints: {
              match: Object.fromEntries(
                ['/admin', '/account'].map((path, i) => [
                  i,
                  {
                    if: `local_port == ${httpPort} && starts_with(path, '${path}')`,
                    then: '403',
                  },
                ]),
              ),
              else: '200',
            },
          },
        },
      },
      'c1',
    ],
  ])
  if (!listeners.some((l) => l.name === consoleListener)) {
    await jmap(api, [
      [
        'x:NetworkListener/set',
        {
          create: {
            c: {
              name: consoleListener,
              protocol: 'http',
              bind: { [`[::]:${consolePort}`]: true },
            },
          },
        },
        'c1',
      ],
    ])
  }
}

export async function syncConsoleClient(api: Api, baseUrls: string[]) {
  const uris = (path: string) =>
    Object.fromEntries(baseUrls.map((b) => [`${b}${path}`, true]))
  const fields = {
    redirectUris: uris('oauth/callback'),
    postLogoutRedirectUris: uris('login'),
  }
  const client = (
    await jmapQuery<{ id: string; clientId: string }>(api, 'OAuthClient', [
      'clientId',
    ])
  ).find((c) => c.clientId === consoleClientId)
  await jmap(api, [
    [
      'x:OAuthClient/set',
      client
        ? { update: { [client.id]: fields } }
        : {
            create: {
              c: {
                clientId: consoleClientId,
                description: 'Stalwart Web Interface (StartOS)',
                grantTypes: { authorizationCode: true, refreshToken: true },
                ...fields,
              },
            },
          },
      'c1',
    ],
  ])

  const [webui] = await jmapQuery<{ id: string; oauthClientId: string | null }>(
    api,
    'Application',
    ['oauthClientId'],
  )
  if (webui.oauthClientId !== consoleClientId) {
    await jmap(api, [
      [
        'x:Application/set',
        { update: { [webui.id]: { oauthClientId: consoleClientId } } },
        'c1',
      ],
      ['x:Action/set', { create: { reload: { '@type': 'UpdateApps' } } }, 'c2'],
    ])
  }
}

type Account = {
  id: string
  '@type': string
  name: string
  domainId: string
  credentials: Record<string, { '@type': string }>
}
// Also clears the account's two-factor secret, so the new password alone signs in.
export async function setAdminAccountPassword(
  api: Api,
  domain: string,
  passwordHash: string,
) {
  const domainId = (
    await jmapQuery<{ id: string; name: string }>(api, 'Domain', ['name'])
  ).find((d) => d.name === domain)?.id
  if (!domainId) throw new Error(`Domain ${domain} not found`)
  const admin = (await jmapQuery<Account>(api, 'Account')).find(
    (a) =>
      a['@type'] === 'User' && a.name === adminUser && a.domainId === domainId,
  )
  const key = Object.entries(admin?.credentials ?? {}).find(
    ([, c]) => c['@type'] === 'Password',
  )?.[0]
  await jmap(api, [
    [
      'x:Account/set',
      admin
        ? {
            update: {
              [admin.id]: key
                ? {
                    [`credentials/${key}/secret`]: passwordHash,
                    [`credentials/${key}/otpUrl`]: null,
                  }
                : {
                    [`credentials/${Object.keys(admin.credentials).length}`]: {
                      '@type': 'Password',
                      secret: passwordHash,
                    },
                  },
            },
          }
        : {
            create: {
              a: {
                '@type': 'User',
                name: adminUser,
                domainId,
                roles: { '@type': 'Admin' },
                description: 'System administrator',
                credentials: {
                  0: { '@type': 'Password', secret: passwordHash },
                },
              },
            },
          },
      'c1',
    ],
  ])
}
