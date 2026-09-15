import { armAcme } from './acme'
import { configJson, storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  checkLive,
  chownCommand,
  getStalwartSub,
  recoveryAdminUser,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Stalwart!'))

  const store = await storeJson.read().const(effects)
  if (
    !store?.adminPassword ||
    !store.hostname ||
    !store.domain ||
    (await configJson.read().once()) === null
  ) {
    throw new Error(i18n('Stalwart has not been set up yet'))
  }
  const { adminPassword, hostname, domain } = store

  return sdk.Daemons.of(effects)
    .addOneshot('chown', {
      subcontainer: getStalwartSub(effects, 'stalwart-chown'),
      exec: { command: chownCommand, user: 'root' },
      requires: [],
    })
    .addDaemon('stalwart', {
      subcontainer: getStalwartSub(effects, 'stalwart-sub'),
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          STALWART_RECOVERY_ADMIN: `${recoveryAdminUser}:${adminPassword}`,
        },
      },
      ready: { display: i18n('Mail Server'), fn: checkLive },
      requires: ['chown'],
    })
    .addOneshot('acme', {
      subcontainer: null,
      exec: {
        fn: async () => {
          await armAcme(adminPassword, hostname, domain)
          return null
        },
      },
      requires: ['stalwart'],
    })
})
