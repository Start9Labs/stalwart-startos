import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.16.25:0',
  releaseNotes: {
    en_US:
      'Updated Stalwart to 0.16.25. Fixes IMAP login timeouts, DKIM key rotation, mail queue quotas and unbounded database log growth. Full release notes: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25',
    es_ES:
      'Stalwart actualizado a 0.16.25. Corrige los tiempos de espera al iniciar sesión por IMAP, la rotación de claves DKIM, las cuotas de la cola de correo y el crecimiento ilimitado de los registros de la base de datos. Notas completas de la versión: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25',
    de_DE:
      'Stalwart auf 0.16.25 aktualisiert. Behebt Zeitüberschreitungen bei der IMAP-Anmeldung, Fehler bei der DKIM-Schlüsselrotation und den Kontingenten der E-Mail-Warteschlange sowie unbegrenztes Wachstum der Datenbankprotokolle. Vollständige Versionshinweise: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25',
    pl_PL:
      'Zaktualizowano Stalwart do 0.16.25. Naprawiono przekroczenia czasu logowania IMAP, rotację kluczy DKIM, limity kolejki poczty i nieograniczony wzrost dzienników bazy danych. Pełne informacje o wydaniu: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25',
    fr_FR:
      'Stalwart mis à jour vers 0.16.25. Corrige les délais d’attente lors de la connexion IMAP, la rotation des clés DKIM, les quotas de la file de messagerie et la croissance illimitée des journaux de la base de données. Notes de version complètes : https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
