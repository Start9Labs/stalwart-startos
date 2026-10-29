import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { mkdir, rename, rm } from 'node:fs/promises'
import { configJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { dataDir, etcDir, legacyDir, stalwartUid } from '../utils'

const targetSubpath = 'data-v1'
const stateSubpath = 'migrate'
const targetDir = '/var/lib/stalwart-v1'
const stateDir = '/var/lib/stalwart-migrate'

const migrateMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: 'etc',
    mountpoint: etcDir,
    readonly: true,
  })
  .mountVolume({
    volumeId: 'main',
    subpath: 'data',
    mountpoint: dataDir,
    readonly: true,
  })
  .mountVolume({
    volumeId: 'main',
    subpath: targetSubpath,
    mountpoint: targetDir,
    readonly: false,
  })
  .mountVolume({
    volumeId: 'main',
    subpath: stateSubpath,
    mountpoint: stateDir,
    readonly: false,
  })

// Every question `stalwart-migrate prepare` asks of a store this package bootstrapped.
const answers = `version = 1

[global.categories]
include = ["settings", "principals", "mail", "calendars", "contacts", "files", "sieve", "identities", "push_subscriptions", "spam_samples", "reports", "archive", "spam_model", "queue", "tasks", "telemetry"]

[instance.oauth_registration."x:OidcProvider"]
action = "accept"

[global.new_permissions]
action = "grant"

[instance.http_forwarded."x:Http"]
source = "xForwardedFor"
hops = 1

[global.changed_defaults]
policy = "recommended"
`

export const v_1_0_0_0 = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.0.0, with full-text search in attachments and files, IMAP metadata, expanded OAuth controls, and bug and security fixes.

- The update converts your mail server's data to Stalwart 1.0's format. It needs free disk space for a second copy of that data, and takes longer the more mail you store.
- If you added an OpenID Connect directory or an AI model in the Admin Console, the update stops and your server stays on the previous version; the service log shows why.
- The Admin Console and Account Manager sign in only at \`https://\` followed by the hostname you chose at setup.
- OAuth clients sign in again. Applications that used arbitrary, unregistered OAuth client IDs also need to be registered as OAuth clients in the Admin Console before they can sign in.
- Calendar, contact and file clients download their data once more, and search results are incomplete until the search index is rebuilt.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)`,
    es_ES: `Stalwart actualizado a 1.0.0, con búsqueda de texto completo en adjuntos y archivos, metadatos IMAP, más controles OAuth y correcciones de errores y seguridad.

- La actualización convierte los datos de tu servidor de correo al formato de Stalwart 1.0. Necesita espacio libre en disco para una segunda copia de esos datos y tarda más cuanto más correo guardes.
- Si añadiste un directorio OpenID Connect o un modelo de IA en la consola de administración, la actualización se detiene y tu servidor sigue en la versión anterior; el registro del servicio indica el motivo.
- La consola de administración y el gestor de cuentas solo permiten iniciar sesión en \`https://\` seguido del nombre de host elegido durante la configuración.
- Los clientes OAuth deben iniciar sesión de nuevo. Las aplicaciones que usaban identificadores de cliente OAuth arbitrarios y no registrados también deben registrarse como clientes OAuth en la consola de administración antes de poder iniciar sesión.
- Los clientes de calendario, contactos y archivos vuelven a descargar sus datos y las búsquedas son incompletas hasta que se reconstruya el índice.

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)`,
    de_DE: `Stalwart auf 1.0.0 aktualisiert: Volltextsuche in Anhängen und Dateien, IMAP-Metadaten, erweiterte OAuth-Steuerung sowie Fehler- und Sicherheitskorrekturen.

- Das Update wandelt die Daten Ihres Mailservers in das Format von Stalwart 1.0 um. Es benötigt freien Speicherplatz für eine zweite Kopie dieser Daten und dauert umso länger, je mehr E-Mails gespeichert sind.
- Wenn Sie in der Admin-Konsole ein OpenID-Connect-Verzeichnis oder ein KI-Modell hinzugefügt haben, bricht das Update ab und Ihr Server bleibt auf der bisherigen Version; das Dienstprotokoll nennt den Grund.
- Die Anmeldung an Admin-Konsole und Kontoverwaltung ist nur unter \`https://\` gefolgt vom bei der Einrichtung gewählten Hostnamen möglich.
- OAuth-Clients müssen sich erneut anmelden. Anwendungen, die beliebige, nicht registrierte OAuth-Client-IDs verwendeten, müssen außerdem in der Admin-Konsole als OAuth-Clients registriert werden, bevor sie sich anmelden können.
- Kalender-, Kontakt- und Datei-Clients laden ihre Daten erneut herunter, und Suchergebnisse sind unvollständig, bis der Suchindex neu aufgebaut ist.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)`,
    pl_PL: `Zaktualizowano Stalwart do 1.0.0: wyszukiwanie pełnotekstowe w załącznikach i plikach, metadane IMAP, rozszerzone opcje OAuth oraz poprawki błędów i bezpieczeństwa.

- Aktualizacja konwertuje dane serwera poczty do formatu Stalwart 1.0. Wymaga wolnego miejsca na dysku na drugą kopię tych danych i trwa tym dłużej, im więcej poczty przechowujesz.
- Jeśli w konsoli administracyjnej dodano katalog OpenID Connect lub model AI, aktualizacja zostanie przerwana, a serwer pozostanie przy poprzedniej wersji; dziennik usługi wskazuje przyczynę.
- Logowanie do konsoli administracyjnej i menedżera kont działa tylko pod adresem \`https://\` z nazwą hosta wybraną podczas konfiguracji.
- Klienci OAuth muszą zalogować się ponownie. Aplikacje, które używały dowolnych, niezarejestrowanych identyfikatorów klienta OAuth, trzeba również zarejestrować jako klientów OAuth w konsoli administracyjnej, zanim będą mogły się zalogować.
- Klienci kalendarza, kontaktów i plików ponownie pobiorą dane, a wyniki wyszukiwania są niepełne do czasu odbudowy indeksu.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)`,
    fr_FR: `Stalwart mis à jour vers 1.0.0 : recherche plein texte dans les pièces jointes et les fichiers, métadonnées IMAP, contrôles OAuth étendus et correctifs de bogues et de sécurité.

- La mise à jour convertit les données de votre serveur de messagerie au format de Stalwart 1.0. Elle nécessite de l’espace disque libre pour une seconde copie de ces données et dure d’autant plus longtemps que vous stockez de courrier.
- Si vous avez ajouté un annuaire OpenID Connect ou un modèle d’IA dans la console d’administration, la mise à jour s’arrête et votre serveur reste sur la version précédente ; le journal du service en indique la raison.
- La connexion à la console d’administration et au gestionnaire de comptes ne fonctionne qu’à l’adresse \`https://\` suivie du nom d’hôte choisi lors de la configuration.
- Les clients OAuth doivent se reconnecter. Les applications qui utilisaient des identifiants de client OAuth arbitraires et non enregistrés doivent aussi être enregistrées comme clients OAuth dans la console d’administration avant de pouvoir se connecter.
- Les clients de calendrier, de contacts et de fichiers téléchargent à nouveau leurs données, et les recherches sont incomplètes jusqu’à la reconstruction de l’index.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0)`,
  },
  migrations: {
    up: async ({ effects }) => {
      if ((await configJson.read().once()) === null) return

      const main = sdk.volumes.main
      for (const dir of [targetSubpath, stateSubpath]) {
        await rm(main.subpath(dir), { recursive: true, force: true })
        await mkdir(main.subpath(dir), { recursive: true })
      }
      await main.writeFile(`${stateSubpath}/answers.toml`, answers)
      await main.writeFile(
        `${stateSubpath}/target.json`,
        JSON.stringify({ '@type': 'RocksDb', path: `${targetDir}/` }),
      )

      const paths = ['--source', `${etcDir}/config.json`, '--state', stateDir]
      await sdk.SubContainer.withTemp(
        effects,
        { imageId: 'migrate' },
        migrateMounts,
        'migrate',
        async (sub) => {
          await sub.execFail(
            [
              'chown',
              '-R',
              `${stalwartUid}:${stalwartUid}`,
              targetDir,
              stateDir,
            ],
            { user: 'root' },
          )
          await sub.execFail([
            'stalwart-migrate',
            'prepare',
            '--non-interactive',
            ...paths,
          ])
          await sub.execFail(
            [
              'stalwart-migrate',
              'run',
              '--final',
              '--yes',
              ...paths,
              '--target',
              `${stateDir}/target.json`,
            ],
            { timeout: null },
          )
        },
      )

      await mkdir(main.subpath(legacyDir))
      await rename(main.subpath('data'), main.subpath(`${legacyDir}/data`))
      await rename(
        main.subpath('etc/config.json'),
        main.subpath(`${legacyDir}/config.json`),
      )
      await rename(
        main.subpath(stateSubpath),
        main.subpath(`${legacyDir}/migrate`),
      )
      await rename(main.subpath(targetSubpath), main.subpath('data'))
      await configJson.write(
        effects,
        JSON.stringify({ '@type': 'RocksDb', path: `${dataDir}/` }),
      )
    },
    down: IMPOSSIBLE,
  },
})
