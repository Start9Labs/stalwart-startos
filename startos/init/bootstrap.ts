import { configJson, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { withMaintenanceStalwart } from '../maintenance'
import { sdk } from '../sdk'
import { Api, consoleClientId, jmap, jmapQuery, webuiDir } from '../utils'

export const bootstrap = sdk.setupOnInit(async (effects, _kind, progress) => {
  const store = await storeJson.read().const(effects)
  if (
    !store?.hostname ||
    !store.domain ||
    !store.adminPasswordSet ||
    store.bootstrapped
  ) {
    return
  }
  const { hostname, domain } = store

  const phase = progress.addPhase(i18n('Configuring Stalwart'))
  phase.start()

  if ((await configJson.read().once()) === null) {
    await withMaintenanceStalwart(effects, 'bootstrap', (api) =>
      jmap(api, [
        [
          'x:Bootstrap/set',
          {
            update: {
              singleton: {
                defaultHostname: hostname,
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
  }

  await withMaintenanceStalwart(
    effects,
    'configure',
    (api) => configure(api, hostname, domain),
    { normalMode: true },
  )
  await storeJson.merge(effects, { bootstrapped: true })

  phase.complete()
})

export async function configure(api: Api, hostname: string, domain: string) {
  const [webui] = await jmapQuery<{ id: string }>(api, 'Application', ['id'])
  const pop3s = (
    await jmapQuery<{ id: string; name: string }>(api, 'NetworkListener', [
      'name',
    ])
  ).find((l) => l.name === 'pop3s')
  const [mailDomain] = await jmapQuery<{ id: string }>(api, 'Domain', ['id'])
  const san =
    hostname === domain ? domain : hostname.slice(0, -domain.length - 1)

  await jmap(api, [
    [
      'x:Http/set',
      {
        update: {
          singleton: { clientIpSource: 'xForwardedFor', forwardedHops: 1 },
        },
      },
      'c1',
    ],
    [
      'x:Application/set',
      {
        update: {
          [webui.id]: {
            unpackDirectory: webuiDir,
            oauthClientId: consoleClientId,
          },
        },
      },
      'c2',
    ],
  ])
  if (pop3s) {
    await jmap(api, [['x:NetworkListener/set', { destroy: [pop3s.id] }, 'c1']])
  }
  const acmeDescription = "Let's Encrypt"
  const acmeProviderId =
    (
      await jmapQuery<{ id: string; description: string }>(
        api,
        'AcmeProvider',
        ['description'],
      )
    ).find((p) => p.description === acmeDescription)?.id ??
    (
      (await jmap(api, [
        [
          'x:AcmeProvider/set',
          {
            create: {
              acme: {
                description: acmeDescription,
                challengeType: 'Http01',
                contact: { [`postmaster@${domain}`]: true },
              },
            },
          },
          'c1',
        ],
      ])) as [[string, { created: { acme: { id: string } } }, string]]
    )[0][1].created.acme.id
  await jmap(api, [
    [
      'x:Domain/set',
      {
        update: {
          [mailDomain.id]: {
            certificateManagement: {
              '@type': 'Automatic',
              acmeProviderId,
              subjectAlternativeNames: { [san]: true },
            },
          },
        },
      },
      'c1',
    ],
  ])
}
