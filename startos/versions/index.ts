import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_16_27_0 } from './v0.16.27.0'
import { v_1_0_0_0 } from './v1.0.0_0'
import { v_1_1_1_1 } from './v1.1.1_1'
import { v_1_1_1_3 } from './v1.1.1_3'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_16_27_0, v_1_0_0_0, v_1_1_1_1, v_1_1_1_3],
})
