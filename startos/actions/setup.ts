import { utils } from '@start9labs/start-sdk'
import { configJson, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  domain: Value.text({
    name: i18n('Email domain'),
    description: i18n(
      'The domain your email addresses will end in, e.g. example.com for user@example.com. More domains can be added later in the Stalwart web console.',
    ),
    required: true,
    default: null,
    placeholder: 'example.com',
    patterns: [utils.Patterns.domain],
  }),
  hostname: Value.text({
    name: i18n('Mail server hostname'),
    description: i18n(
      'The public name of this server, e.g. mail.example.com. Other mail servers deliver to it, your mail clients connect to it, and its TLS certificate is issued for it. It must be the email domain itself or a name under it.',
    ),
    required: true,
    default: null,
    placeholder: 'mail.example.com',
    patterns: [utils.Patterns.domain],
  }),
})

export const setup = sdk.Action.withInput(
  'setup',

  async ({ effects }) => ({
    name: i18n('Set Up Mail Server'),
    description: i18n(
      'Choose the email domain and the hostname of this mail server.',
    ),
    warning: [
      i18n(
        "These cannot be changed from StartOS once set. To change them later, use Stalwart's Admin Console web interface.",
      ),
      (await storeJson.read((s) => s.adminPasswordSet).const(effects)) &&
        i18n(
          "If you use (or plan to use) a StartTunnel gateway with this mail server, first open Services › Stalwart › Outbound Traffic and choose it as Stalwart's gateway, before you run this action. Otherwise Stalwart's outgoing mail and its Let's Encrypt certificate requests leave from your default internet connection's IP address.",
        ),
    ]
      .filter(Boolean)
      .join('<br /><br />'),
    allowedStatuses: 'only-stopped',
    group: i18n('Setup'),
    visibility: 'hidden',
  }),

  inputSpec,

  async () => {
    const store = await storeJson.read().once()
    return { hostname: store?.hostname, domain: store?.domain }
  },

  async ({ effects, input }) => {
    const domain = input.domain.trim().toLowerCase()
    const hostname = input.hostname.trim().toLowerCase()
    if (hostname !== domain && !hostname.endsWith(`.${domain}`)) {
      throw new Error(
        i18n('The hostname must be the email domain or a name under it'),
      )
    }
    if ((await configJson.read().once()) !== null) {
      const store = await storeJson.read().once()
      if (store?.hostname === hostname && store.domain === domain) return null
      throw new Error(
        i18n(
          "These cannot be changed from StartOS once set. To change them later, use Stalwart's Admin Console web interface.",
        ),
      )
    }
    await storeJson.merge(effects, { domain, hostname })
    return null
  },
)
