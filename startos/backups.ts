import { sdk } from './sdk'
import { legacyDir } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.withOptions({ exclude: [`/${legacyDir}`] }).addVolume('main'),
)
