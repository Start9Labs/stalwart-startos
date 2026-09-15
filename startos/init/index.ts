import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { watchSetup } from './watchSetup'
import { bootstrap } from './bootstrap'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  watchSetup,
  bootstrap,
)

export const uninit = sdk.setupUninit(versionGraph)
