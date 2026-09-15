import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
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

  async () => ({
    name: i18n('Set Up Mail Server'),
    description: i18n(
      'Choose the email domain and the hostname of this mail server.',
    ),
    warning: i18n(
      'These cannot be changed from StartOS once set. To change them later, use the Stalwart web console.',
    ),
    allowedStatuses: 'only-stopped',
    group: i18n('Setup'),
    visibility: 'hidden',
  }),

  inputSpec,

  async () => ({}),

  async ({ effects, input }) => {
    const domain = input.domain.trim().toLowerCase()
    const hostname = input.hostname.trim().toLowerCase()
    if (hostname !== domain && !hostname.endsWith(`.${domain}`)) {
      throw new Error(
        i18n('The hostname must be the email domain or a name under it'),
      )
    }
    await storeJson.merge(effects, { domain, hostname })
    return null
  },
)
