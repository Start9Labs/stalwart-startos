import { configJson, storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { consoleBaseUrls } from './interfaces'
import { withMaintenanceStalwart } from './maintenance'
import { sdk } from './sdk'
import {
  armAcme,
  checkLive,
  getStalwartSub,
  separateConsoleListener,
  setAdminAccountPassword,
  syncConsoleClient,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Stalwart!'))

  const store = await storeJson
    .read(({ hostname, domain, adminPasswordSet }) => ({
      hostname,
      domain,
      adminPasswordSet,
    }))
    .const(effects)
  if (
    !store?.adminPasswordSet ||
    !store.hostname ||
    !store.domain ||
    ((await storeJson.read((s) => s.bootstrapped).once()) &&
      (await configJson.read().once()) === null)
  ) {
    throw new Error(i18n('Stalwart has not been set up yet'))
  }
  const { hostname, domain } = store

  return sdk.Daemons.dynamic(effects, async ({ effects: runEffects }) => {
    if (!(await storeJson.read((s) => s.bootstrapped).const(runEffects))) {
      return sdk.Daemons.of(runEffects).addHealthCheck('stalwart', {
        ready: {
          display: i18n('Mail Server'),
          fn: () => ({
            result: 'starting',
            message: i18n('Configuring Stalwart'),
          }),
        },
        requires: [],
      })
    }
    const baseUrls = (await consoleBaseUrls(runEffects).const()) ?? []

    return sdk.Daemons.of(runEffects)
      .addOneshot('maintenance', {
        subcontainer: null,
        exec: {
          fn: async () => {
            // Subcontainers die with the context that made them, and a re-run replaces runEffects.
            await withMaintenanceStalwart(
              effects,
              'maintenance',
              async (api) => {
                const { adminPasswordHash, ...rest } =
                  (await storeJson.read().once()) ?? {}
                if (adminPasswordHash) {
                  await setAdminAccountPassword(api, adminPasswordHash)
                  await storeJson.write(effects, rest)
                }
                await separateConsoleListener(api)
                await armAcme(api, hostname, domain)
                await syncConsoleClient(api, baseUrls)
              },
            )
            return null
          },
        },
        uses: baseUrls,
        requires: [],
      })
      .addDaemon('stalwart', {
        subcontainer: getStalwartSub(runEffects, 'stalwart-sub'),
        exec: {
          command: sdk.useEntrypoint(),
          env: { STALWART_RECOVERY_MODE_BIND: '127.0.0.1' },
        },
        ready: { display: i18n('Mail Server'), fn: checkLive },
        requires: ['maintenance'],
      })
  })
})
