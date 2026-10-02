import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.16.24:0',
  releaseNotes: {
    en_US:
      'Updated Stalwart to 0.16.24. Full release notes: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.23 and https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.24',
    es_ES:
      'Stalwart actualizado a 0.16.24. Notas completas de las versiones: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.23 y https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.24',
    de_DE:
      'Stalwart auf 0.16.24 aktualisiert. Vollständige Versionshinweise: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.23 und https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.24',
    pl_PL:
      'Zaktualizowano Stalwart do 0.16.24. Pełne informacje o wydaniach: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.23 i https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.24',
    fr_FR:
      'Stalwart mis à jour vers 0.16.24. Notes de version complètes : https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.23 et https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.24',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
