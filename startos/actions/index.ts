import { sdk } from '../sdk'
import { setAdminPassword } from './setAdminPassword'
import { setup } from './setup'
import { showDnsRecords } from './showDnsRecords'

export const actions = sdk.Actions.of()
  .addAction(setup)
  .addAction(setAdminPassword)
  .addAction(showDnsRecords)
