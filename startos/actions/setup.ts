import { utils } from '@start9labs/start-sdk'
import { configJson, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { adminPublicDomains } from '../interfaces'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  hostname: Value.dynamicSelect(async ({ effects }) => {
    const domains = (await adminPublicDomains(effects).once()) ?? []
    return {
      name: i18n('Mail server hostname'),
      description: i18n(
        'The public name of this server, e.g. mail.example.com. Other mail servers deliver to it, your mail clients connect to it, its TLS certificate is issued for it, and the web console accepts sign-in only there. It must be the email domain itself or a name under it.',
      ),
      values: Object.fromEntries(domains.map((d) => [d, d])),
      default: null,
      disabled: domains.length
        ? false
        : i18n(
            'First, add a public domain under Services > Stalwart > Interfaces > Admin Console',
          ),
    }
  }),
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
})

export const setup = sdk.Action.withInput(
  'setup',

  async ({ effects }) => {
    const hostname = (await configJson.read().const(effects))
      ? await storeJson.read((s) => s.hostname).const(effects)
      : undefined
    return {
      name: i18n('Set Up Mail Server'),
      description: i18n(
        'Choose the email domain and the hostname of this mail server.',
      ),
      warning: hostname
        ? i18n(
            'This server is ${hostname}, which cannot be changed from StartOS. If it is missing from the list, add it back under Services > Stalwart > Interfaces > Admin Console: click Add Domain and choose Public Domain.',
            { hostname },
          )
        : i18n(
            "Under Services > Stalwart > Interfaces > Admin Console, click Add Domain, choose Public Domain, and add your mail server's hostname (for example, mail.example.com) before choosing it here. The hostname and email domain cannot be changed from StartOS once set. To change them later, use the Stalwart web console.",
          ),
      allowedStatuses: 'only-stopped',
      group: i18n('Setup'),
      visibility: 'hidden',
    }
  },

  inputSpec,

  async () => {
    const store = await storeJson.read().once()
    return { hostname: store?.hostname, domain: store?.domain }
  },

  async ({ effects, input }) => {
    const domain = input.domain.trim().toLowerCase()
    const { hostname } = input
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
          'The hostname and email domain cannot be changed from StartOS once Stalwart is set up. To change them, use the Stalwart web console.',
        ),
      )
    }
    await storeJson.merge(effects, { domain, hostname })
    return null
  },
)
