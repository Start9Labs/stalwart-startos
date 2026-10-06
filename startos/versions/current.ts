import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.16.25:1',
  releaseNotes: {
    en_US: `Updated Stalwart to 0.16.25. Fixes IMAP login timeouts, DKIM key rotation, mail queue quotas and unbounded database log growth. Full release notes: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25

- Set Admin Password asks for confirmation before replacing an existing password.
- Show DNS Records shows each record on its own line, and offers each domain's zone file as a download.`,
    es_ES: `Stalwart actualizado a 0.16.25. Corrige los tiempos de espera al iniciar sesión por IMAP, la rotación de claves DKIM, las cuotas de la cola de correo y el crecimiento ilimitado de los registros de la base de datos. Notas completas de la versión: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25

- Establecer contraseña de administrador pide confirmación antes de sustituir una contraseña existente.
- Mostrar registros DNS muestra cada registro en su propia línea y ofrece el archivo de zona de cada dominio como descarga.`,
    de_DE: `Stalwart auf 0.16.25 aktualisiert. Behebt Zeitüberschreitungen bei der IMAP-Anmeldung, Fehler bei der DKIM-Schlüsselrotation und den Kontingenten der E-Mail-Warteschlange sowie unbegrenztes Wachstum der Datenbankprotokolle. Vollständige Versionshinweise: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25

- Administratorpasswort festlegen fragt nach einer Bestätigung, bevor ein bestehendes Passwort ersetzt wird.
- DNS-Einträge anzeigen zeigt jeden Eintrag in einer eigenen Zeile und bietet die Zonendatei jeder Domain zum Herunterladen an.`,
    pl_PL: `Zaktualizowano Stalwart do 0.16.25. Naprawiono przekroczenia czasu logowania IMAP, rotację kluczy DKIM, limity kolejki poczty i nieograniczony wzrost dzienników bazy danych. Pełne informacje o wydaniu: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25

- Ustaw hasło administratora prosi o potwierdzenie przed zastąpieniem istniejącego hasła.
- Pokaż rekordy DNS wyświetla każdy rekord w osobnym wierszu i udostępnia plik strefy każdej domeny do pobrania.`,
    fr_FR: `Stalwart mis à jour vers 0.16.25. Corrige les délais d’attente lors de la connexion IMAP, la rotation des clés DKIM, les quotas de la file de messagerie et la croissance illimitée des journaux de la base de données. Notes de version complètes : https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.25

- Définir le mot de passe administrateur demande une confirmation avant de remplacer un mot de passe existant.
- Afficher les enregistrements DNS présente chaque enregistrement sur sa propre ligne et propose le fichier de zone de chaque domaine en téléchargement.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
