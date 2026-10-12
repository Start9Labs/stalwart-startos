import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.16.26:0',
  releaseNotes: {
    en_US: 'Updated Stalwart to 0.16.26. Fixes DNSSEC resolution, excessive blob rewriting during database compaction, Milter timeouts and JMAP message updates. Updated start-sdk to 3.0.6. Full release notes: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.26',
    es_ES: 'Stalwart actualizado a 0.16.26. Corrige la resolución DNSSEC, la reescritura excesiva de blobs durante la compactación de la base de datos, los tiempos de espera de Milter y las actualizaciones de mensajes JMAP. start-sdk actualizado a 3.0.6. Notas completas de la versión: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.26',
    de_DE: 'Stalwart auf 0.16.26 aktualisiert. Behebt Fehler bei der DNSSEC-Auflösung, übermäßiges Neuschreiben von Blobs bei der Datenbankkomprimierung, Milter-Zeitüberschreitungen und JMAP-Nachrichtenaktualisierungen. start-sdk auf 3.0.6 aktualisiert. Vollständige Versionshinweise: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.26',
    pl_PL: 'Zaktualizowano Stalwart do 0.16.26. Naprawiono rozwiązywanie DNSSEC, nadmierne przepisywanie blobów podczas kompaktowania bazy danych, przekroczenia czasu Milter i aktualizacje wiadomości JMAP. Zaktualizowano start-sdk do 3.0.6. Pełne informacje o wydaniu: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.26',
    fr_FR: 'Stalwart mis à jour vers 0.16.26. Corrige la résolution DNSSEC, la réécriture excessive des blobs pendant la compaction de la base de données, les délais d’attente de Milter et les mises à jour des messages JMAP. start-sdk mis à jour vers 3.0.6. Notes de version complètes : https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.26',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
