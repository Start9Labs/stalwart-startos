import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { hostId } from '../interfaces'
import { sdk } from '../sdk'
import { jmapQuery, smtpPort } from '../utils'

export const showDnsRecords = sdk.Action.withoutInput(
  'show-dns-records',

  async () => ({
    name: i18n('Show DNS Records'),
    description: i18n(
      'List the DNS records (MX, SPF, DKIM, DMARC, autoconfig and more) to publish for each of your email domains.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const store = await storeJson.read().once()
    if (!store?.adminPassword || !store.hostname) {
      throw new Error(i18n('Stalwart has not been set up yet'))
    }
    const { hostname, adminPassword } = store

    const addresses = await sdk.host
      .getOwn(effects, hostId, (h) => h?.bindings[smtpPort]?.addresses ?? null)
      .once()
    const enabled = new Set(addresses?.enabled)
    const gateways = new Map<string, string[]>()
    for (const {
      public: isPublic,
      hostname: ip,
      port,
      metadata,
    } of addresses?.available ?? []) {
      if (!isPublic || (metadata.kind !== 'ipv4' && metadata.kind !== 'ipv6'))
        continue
      const [record, key] =
        metadata.kind === 'ipv4'
          ? ['A', `${ip}:${port}`]
          : ['AAAA', `[${ip}]:${port}`]
      if (!enabled.has(key)) continue
      const records = gateways.get(metadata.gateway) ?? []
      records.push(`${hostname}. IN ${record} ${ip}`)
      gateways.set(metadata.gateway, records)
    }

    const domains = await jmapQuery<{ name: string; dnsZoneFile: string }>(
      adminPassword,
      'Domain',
      ['name', 'dnsZoneFile'],
    )

    return {
      version: '1',
      title: i18n('DNS Records'),
      message: gateways.size
        ? i18n('Publish these records at your DNS provider.')
        : i18n(
            'No public address is enabled on the SMTP interface yet, so there is no address record to publish. Enable one, then run this again.',
          ),
      result: {
        type: 'group',
        value: [
          ...[...gateways].map(([gateway, records]) => ({
            type: 'multiline' as const,
            name: `${i18n('Address records')} — ${gateway}`,
            description: null,
            value: records.join('\n'),
            copyable: true,
          })),
          ...domains.map(({ name, dnsZoneFile }) => ({
            type: 'multiline' as const,
            name,
            description: null,
            value: dnsZoneFile,
            copyable: true,
            filename: `${name}.zone`,
          })),
        ],
      },
    }
  },
)
