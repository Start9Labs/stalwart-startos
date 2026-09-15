import { configJson, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  checkLive,
  chownCommand,
  getStalwartSub,
  jmap,
  jmapQuery,
  recoveryAdminUser,
  webuiDir,
} from '../utils'

export const bootstrap = sdk.setupOnInit(async (effects, _kind, progress) => {
  const store = await storeJson.read().const(effects)
  if (!store?.hostname || !store.domain || !store.adminPassword) return
  if ((await configJson.read().once()) !== null) return
  const { hostname, domain, adminPassword } = store

  const runWith = (
    id: string,
    env: Record<string, string>,
    fn: () => Promise<unknown>,
  ) =>
    sdk.Daemons.of(effects)
      .addOneshot('chown', {
        subcontainer: getStalwartSub(effects, `${id}-chown`),
        exec: { command: chownCommand, user: 'root' },
        requires: [],
      })
      .addDaemon('stalwart', {
        subcontainer: getStalwartSub(effects, `${id}-sub`),
        exec: { command: sdk.useEntrypoint(), env },
        ready: { display: null, fn: checkLive },
        requires: ['chown'],
      })
      .addOneshot('run', {
        subcontainer: null,
        exec: {
          fn: async () => {
            await fn()
            return null
          },
        },
        requires: ['stalwart'],
      })
      .runUntilSuccess(300_000)

  const recoveryAdmin = {
    STALWART_RECOVERY_ADMIN: `${recoveryAdminUser}:${adminPassword}`,
  }

  const phase = progress.addPhase(i18n('Configuring Stalwart'))
  phase.start()

  await runWith('bootstrap', recoveryAdmin, () =>
    jmap(adminPassword, [
      [
        'x:Bootstrap/set',
        {
          update: {
            singleton: {
              serverHostname: hostname,
              defaultDomain: domain,
              requestTlsCertificate: false,
              generateDkimKeys: true,
              tracer: { '@type': 'Stdout', events: {} },
              dnsServer: { '@type': 'Manual' },
            },
          },
        },
        'c1',
      ],
    ]),
  )

  await runWith('configure', recoveryAdmin, () =>
    configure(adminPassword, hostname, domain),
  )

  phase.complete()
})

async function configure(
  adminPassword: string,
  hostname: string,
  domain: string,
) {
  const [webui] = await jmapQuery<{ id: string }>(
    adminPassword,
    'Application',
    ['id'],
  )
  const pop3s = (
    await jmapQuery<{ id: string; name: string }>(
      adminPassword,
      'NetworkListener',
      ['name'],
    )
  ).find((l) => l.name === 'pop3s')
  const [mailDomain] = await jmapQuery<{ id: string }>(
    adminPassword,
    'Domain',
    ['id'],
  )
  const san =
    hostname === domain ? domain : hostname.slice(0, -domain.length - 1)

  await jmap(adminPassword, [
    ['x:Http/set', { update: { singleton: { useXForwarded: true } } }, 'c1'],
    [
      'x:Application/set',
      { update: { [webui.id]: { unpackDirectory: webuiDir } } },
      'c2',
    ],
  ])
  if (pop3s) {
    await jmap(adminPassword, [
      ['x:NetworkListener/set', { destroy: [pop3s.id] }, 'c1'],
    ])
  }
  const [[, { created }]] = (await jmap(adminPassword, [
    [
      'x:AcmeProvider/set',
      {
        create: {
          acme: {
            challengeType: 'Http01',
            contact: { [`postmaster@${domain}`]: true },
          },
        },
      },
      'c1',
    ],
  ])) as [[string, { created: { acme: { id: string } } }, string]]
  await jmap(adminPassword, [
    [
      'x:Domain/set',
      {
        update: {
          [mailDomain.id]: {
            certificateManagement: {
              '@type': 'Automatic',
              acmeProviderId: created.acme.id,
              subjectAlternativeNames: { [san]: true },
            },
          },
        },
      },
      'c1',
    ],
  ])
}
