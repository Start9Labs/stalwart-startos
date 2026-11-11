import { setAdminPassword } from '../actions/setAdminPassword'
import { setup } from '../actions/setup'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { adminPublicDomains } from '../interfaces'
import { sdk } from '../sdk'

export const watchSetup = sdk.setupOnInit(async (effects) => {
  const store = await storeJson.read().const(effects)
  const domains = (await adminPublicDomains(effects).const()) ?? []

  if (!store?.hostname || !store.domain) {
    await sdk.action.createOwnTask(effects, setup, 'critical', {
      reason: i18n(
        "Under Services > Stalwart > Interfaces > Admin Console, click Add Domain, choose Public Domain, and add your mail server's hostname (for example, mail.example.com). Then run this action and choose that hostname, along with your email domain.",
      ),
    })
  } else if (!domains.includes(store.hostname)) {
    await sdk.action.createOwnTask(effects, setup, 'important', {
      reason: i18n(
        'Add ${hostname} back under Services > Stalwart > Interfaces > Admin Console: click Add Domain and choose Public Domain. Web console sign-in and certificate renewal need it.',
        { hostname: store.hostname },
      ),
    })
  } else {
    await sdk.action.clearTask(effects, `stalwart:${setup.id}`)
  }

  if (!store?.adminPassword) {
    await sdk.action.createOwnTask(effects, setAdminPassword, 'critical', {
      reason: i18n(
        'Set the admin password before signing in to the Stalwart web console',
      ),
    })
  }
})
