import { healthFns, T } from '@start9labs/start-sdk'
import { i18n } from './i18n'
import { sdk } from './sdk'

export const httpPort = 8080
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

export const recoveryAdminUser = 'admin'

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

// Upstream's own HEALTHCHECK sends X-Forwarded-For; without it every probe logs a warning.
export async function checkLive(): Promise<healthFns.HealthCheckResult> {
  try {
    const res = await fetch(`http://127.0.0.1:${httpPort}/healthz/live`, {
      headers: { 'X-Forwarded-For': '127.0.0.1' },
      signal: AbortSignal.timeout(5_000),
    })
    if (res.ok) return { result: 'success', message: i18n('Stalwart is ready') }
  } catch {}
  return { result: 'failure', message: i18n('Stalwart is not ready') }
}

type JmapCall = [string, Record<string, unknown>, string]

export async function jmap(
  adminPassword: string,
  methodCalls: JmapCall[],
): Promise<JmapCall[]> {
  const res = await fetch(`http://127.0.0.1:${httpPort}/jmap/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${recoveryAdminUser}:${adminPassword}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'X-Forwarded-For': '127.0.0.1',
    },
    body: JSON.stringify({
      using: ['urn:ietf:params:jmap:core', 'urn:stalwart:jmap'],
      methodCalls,
    }),
  })
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
  adminPassword: string,
  type: string,
  properties?: string[],
): Promise<A[]> {
  const [, [, { list }]] = await jmap(adminPassword, [
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
type Task = { id: string; '@type': string; domainId?: string }

// A renewal task claimed by an instance that was killed stays locked for an hour, and a
// task that has exhausted its retries is never rescheduled by Stalwart itself.
export async function armAcme(
  adminPassword: string,
  hostname: string,
  domain: string,
) {
  const now = new Date()
  const certs = await jmapQuery<Certificate>(adminPassword, 'Certificate', [
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
    await jmapQuery<Domain>(adminPassword, 'Domain', [
      'name',
      'certificateManagement',
    ])
  ).find((d) => d.name === domain)
  if (mailDomain?.certificateManagement['@type'] !== 'Automatic') return

  const stale = (await jmapQuery<Task>(adminPassword, 'Task'))
    .filter((t) => t['@type'] === 'AcmeRenewal' && t.domainId === mailDomain.id)
    .map((t) => t.id)
  await jmap(adminPassword, [
    [
      'x:Task/set',
      {
        destroy: stale,
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
