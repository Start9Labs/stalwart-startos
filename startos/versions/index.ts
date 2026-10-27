import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_16_27_0 } from './v0.16.27.0'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_16_27_0],
})
