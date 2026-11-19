import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { adminUser, hashPassword } from '../utils'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',

  async ({ effects }) => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      '<p>Generate a new random password for the Stalwart administrator account. It also turns off two-factor authentication on that account, so the new password alone signs in.</p><p>This action can only run while Stalwart is stopped, so the server loads the new password the next time it starts.</p>',
    ),
    warning: (await storeJson.read((s) => s.adminPasswordSet).const(effects))
      ? i18n(
          'Replaces the current admin password. The old password stops working the next time Stalwart starts.',
        )
      : null,
    allowedStatuses: 'only-stopped',
    group: i18n('Setup'),
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const adminPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 32,
    })
    await storeJson.merge(effects, {
      adminPasswordSet: true,
      adminPasswordHash: hashPassword(adminPassword),
    })
    const domain = await storeJson.read((s) => s.domain).once()

    return {
      version: '1',
      title: i18n('Stalwart Admin Credentials'),
      message: i18n(
        'Use these to sign in to the Stalwart web console. The password is shown only now.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: domain
              ? `${adminUser}@${domain}`
              : i18n('admin@ followed by your email domain'),
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
            launchable: false,
          },
        ],
      },
    }
  },
)
