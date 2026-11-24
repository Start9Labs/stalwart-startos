import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { setup } from './setup'
import { showDnsRecords } from './showDnsRecords'
import { unblockIps } from './unblockIps'

export const actions = sdk.Actions.of()
  .addAction(setup)
  .addAction(setAdminPassword)
  .addAction(showDnsRecords)
  .addAction(unblockIps)
