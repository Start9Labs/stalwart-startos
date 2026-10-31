import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.1:1',
  releaseNotes: {
    en_US:
      "Documentation-only release: the instructions link upstream's current pages for accounts and the FAQ.",
    es_ES:
      'Versión solo de documentación: las instrucciones enlazan las páginas actuales de cuentas y de preguntas frecuentes de Stalwart.',
    de_DE:
      'Reine Dokumentationsversion: Die Anleitung verlinkt die aktuellen Stalwart-Seiten zu Konten und zu den häufigen Fragen.',
    pl_PL:
      'Wydanie wyłącznie dokumentacyjne: instrukcje prowadzą do aktualnych stron Stalwart o kontach i do najczęstszych pytań.',
    fr_FR:
      'Version de documentation uniquement : les instructions renvoient vers les pages actuelles de Stalwart sur les comptes et la FAQ.',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
