import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { adminPasswordInput, adminUser, httpPort, jmap } from '../utils'

const { InputSpec, Value, List } = sdk

const inputSpec = InputSpec.of({
  password: adminPasswordInput,
  addresses: Value.list(
    List.text(
      {
        name: i18n('Addresses to unblock'),
        description: i18n(
          'IP addresses or networks exactly as Stalwart blocked them. Leave the list empty to unblock every address.',
        ),
        default: [],
      },
      { placeholder: '203.0.113.7' },
    ),
  ),
})

type BlockedIp = {
  id: string
  address: string
  reason: string
  createdAt: string
  expiresAt: string | null
}

const pageSize = 100

export const unblockIps = sdk.Action.withInput(
  'unblock-ips',

  async () => ({
    name: i18n('Unblock IP Addresses'),
    description: i18n(
      'Remove addresses that Stalwart has blocked, for example after too many failed sign-ins, so they can connect again.',
    ),
    warning: null,
    allowedStatuses: 'only-running',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async () => ({}),

  async ({ input }) => {
    const api = {
      port: httpPort,
      credentials: `${adminUser}:${input.password}`,
    }

    const blocked: BlockedIp[] = []
    for (let position = 0; ; position += pageSize) {
      const [, [, { list }]] = await jmap(api, [
        ['x:BlockedIp/query', { position, limit: pageSize }, 'q'],
        [
          'x:BlockedIp/get',
          {
            '#ids': { resultOf: 'q', name: 'x:BlockedIp/query', path: '/ids' },
          },
          'g',
        ],
      ])
      const page = list as BlockedIp[]
      blocked.push(...page)
      if (page.length < pageSize) break
    }

    const wanted = new Set(input.addresses.map((a) => a.trim().toLowerCase()))
    const selected = wanted.size
      ? blocked.filter((b) => wanted.has(b.address.toLowerCase()))
      : blocked
    for (const b of selected) wanted.delete(b.address.toLowerCase())

    for (let i = 0; i < selected.length; i += pageSize) {
      await jmap(api, [
        [
          'x:BlockedIp/set',
          { destroy: selected.slice(i, i + pageSize).map((b) => b.id) },
          's',
        ],
      ])
    }
    // A failed reload can leave deleted records banned in memory.
    await jmap(api, [
      [
        'x:Action/set',
        { create: { reload: { '@type': 'ReloadBlockedIps' } } },
        'r',
      ],
    ])

    const reasons: Record<string, string> = {
      rcptToFailure: i18n('invalid recipients'),
      authFailure: i18n('failed sign-ins'),
      loitering: i18n('idle connections'),
      portScanning: i18n('port scanning'),
      manual: i18n('blocked by an administrator'),
      other: i18n('other'),
    }

    return {
      version: '1',
      title: i18n('Unblock IP Addresses'),
      message: [
        selected.length
          ? i18n('These addresses can connect again.')
          : input.addresses.length
            ? i18n('None of these addresses is blocked.')
            : i18n('No address is blocked.'),
        selected.length &&
          wanted.size &&
          `${i18n('Not blocked')}: ${[...wanted].join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n\n'),
      result: selected.length
        ? {
            type: 'multiline',
            name: i18n('Unblocked'),
            description: null,
            value: selected
              .map(
                (b) =>
                  `${b.address} (${reasons[b.reason] ?? b.reason}, ${b.createdAt})`,
              )
              .join('\n'),
            copyable: true,
            qr: false,
            masked: false,
            filename: null,
          }
        : null,
    }
  },
)
