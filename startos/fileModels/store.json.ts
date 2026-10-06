import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  hostname: z.string().optional().catch(undefined),
  domain: z.string().optional().catch(undefined),
  adminPassword: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)

export const configJson = FileHelper.string({
  base: sdk.volumes.main,
  subpath: 'etc/config.json',
})
