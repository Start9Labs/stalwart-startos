import { T, utils } from '@start9labs/start-sdk'
import { setInterfaces } from './interfaces'
import { sdk } from './sdk'
import {
  Api,
  checkLive,
  chownCommand,
  getStalwartSub,
  hashPassword,
  httpPort,
  maintenancePort,
  recoveryAdminUser,
} from './utils'

// Runs a Stalwart unreachable from outside the container, whose recovery admin exists only for this call.
// `normalMode` opens the configured listeners, so it disables every binding for the duration.
export async function withMaintenanceStalwart(
  effects: T.Effects,
  id: string,
  fn: (api: Api) => Promise<unknown>,
  { normalMode = false } = {},
) {
  const password = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 32,
  })
  const port = normalMode ? httpPort : maintenancePort
  if (normalMode) await sdk.clearBindings(effects, { except: [] })
  try {
    await sdk.Daemons.of(effects)
      .addOneshot('chown', {
        subcontainer: getStalwartSub(effects, `${id}-chown`),
        exec: { command: chownCommand, user: 'root' },
        requires: [],
      })
      .addDaemon('stalwart', {
        subcontainer: getStalwartSub(effects, `${id}-sub`),
        exec: {
          command: sdk.useEntrypoint(),
          env: {
            // A random 32-character secret needs no key stretching.
            STALWART_RECOVERY_ADMIN: `${recoveryAdminUser}:${hashPassword(password, 1000)}`,
            STALWART_RECOVERY_MODE_PORT: String(maintenancePort),
            ...(!normalMode && { STALWART_RECOVERY_MODE: '1' }),
          },
        },
        ready: { display: null, fn: () => checkLive(port) },
        requires: ['chown'],
      })
      .addOneshot('run', {
        subcontainer: null,
        exec: {
          fn: async () => {
            await fn({ port, credentials: `${recoveryAdminUser}:${password}` })
            return null
          },
        },
        requires: ['stalwart'],
      })
      .runUntilSuccess(300_000)
  } finally {
    if (normalMode) await setInterfaces(effects)
  }
}
