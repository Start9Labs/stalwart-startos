import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

// The graph's floor: stalwart-migrate reads only 0.16.27 stores, so older 0.16 installs take a 0.16.27 release first.
export const v_0_16_27_0 = VersionInfo.of({
  version: '0.16.27:0',
  releaseNotes: '',
  migrations: {
    up: IMPOSSIBLE,
    down: IMPOSSIBLE,
  },
})
