import { setAdminPassword } from '../actions/setAdminPassword'
import { setup } from '../actions/setup'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const watchSetup = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)

  if (!store?.hostname || !store.domain) {
    await sdk.action.createOwnTask(effects, setup, 'critical', {
      reason: i18n('Choose the email domain and hostname of your mail server'),
    })
  }

  if (!store?.adminPassword) {
    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: i18n(
        'Set the admin password before signing in to the Stalwart web console',
      ),
    })
  }
})
