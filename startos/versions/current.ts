import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { withMaintenanceStalwart } from '../maintenance'
import { installConsoleBundle } from '../utils'

export const current = VersionInfo.of({
  version: '1.2.0:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.2.0.

- New: server-side mail rules, and blocked and safe sender lists
- New: working hours and free/busy sharing for calendars
- New: room and equipment accounts with automatic or manual booking
- New: read receipts (message disposition notifications)
- New: Microsoft Exchange protocols for Outlook, Apple Mail and ActiveSync devices, off by default
- Fixes across IMAP, JMAP, calendars, Sieve and mail delivery, including new mail that some IMAP clients skipped and Apple Mail syncing changes late
- Existing user, group and administrator roles receive the permissions the new features need, and the Admin Console updates to version 2.1.1
- The Admin Console ships inside the package and updates only with it

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.0)`,
    es_ES: `Stalwart actualizado a 1.2.0.

- Nuevo: reglas de correo en el servidor y listas de remitentes bloqueados y seguros
- Nuevo: horario laboral y uso compartido de disponibilidad en los calendarios
- Nuevo: cuentas de salas y equipos con reserva automática o manual
- Nuevo: confirmaciones de lectura (notificaciones de disposición de mensajes)
- Nuevo: protocolos de Microsoft Exchange para Outlook, Apple Mail y dispositivos ActiveSync, desactivados por defecto
- Correcciones en IMAP, JMAP, calendarios, Sieve y entrega de correo, como correo nuevo que algunos clientes IMAP omitían y Apple Mail sincronizando cambios con retraso
- Los roles existentes de usuario, grupo y administrador reciben los permisos que necesitan las nuevas funciones, y la consola de administración se actualiza a la versión 2.1.1
- La consola de administración viene incluida en el paquete y solo se actualiza con él

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.0)`,
    de_DE: `Stalwart auf 1.2.0 aktualisiert.

- Neu: serverseitige Mailregeln sowie Listen blockierter und sicherer Absender
- Neu: Arbeitszeiten und Freigabe von Frei/Gebucht-Zeiten für Kalender
- Neu: Raum- und Ausstattungskonten mit automatischer oder manueller Buchung
- Neu: Lesebestätigungen (Message Disposition Notifications)
- Neu: Microsoft-Exchange-Protokolle für Outlook, Apple Mail und ActiveSync-Geräte, standardmäßig deaktiviert
- Korrekturen bei IMAP, JMAP, Kalendern, Sieve und Mailzustellung, darunter neue Mails, die manche IMAP-Clients übersprangen, und verspätet synchronisierte Änderungen in Apple Mail
- Bestehende Benutzer-, Gruppen- und Administratorrollen erhalten die Berechtigungen, die die neuen Funktionen brauchen, und die Admin-Konsole wird auf Version 2.1.1 aktualisiert
- Die Admin-Konsole ist im Paket enthalten und wird nur mit ihm aktualisiert

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.0)`,
    pl_PL: `Zaktualizowano Stalwart do 1.2.0.

- Nowość: reguły poczty po stronie serwera oraz listy zablokowanych i bezpiecznych nadawców
- Nowość: godziny pracy i udostępnianie informacji o dostępności w kalendarzach
- Nowość: konta sal i sprzętu z automatyczną lub ręczną rezerwacją
- Nowość: potwierdzenia przeczytania (powiadomienia o dyspozycji wiadomości)
- Nowość: protokoły Microsoft Exchange dla Outlooka, Apple Mail i urządzeń ActiveSync, domyślnie wyłączone
- Poprawki w IMAP, JMAP, kalendarzach, Sieve i dostarczaniu poczty, m.in. nowa poczta pomijana przez niektórych klientów IMAP i opóźniona synchronizacja zmian w Apple Mail
- Istniejące role użytkownika, grupy i administratora otrzymują uprawnienia potrzebne nowym funkcjom, a konsola administracyjna aktualizuje się do wersji 2.1.1
- Konsola administracyjna jest dołączona do pakietu i aktualizuje się tylko razem z nim

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.0)`,
    fr_FR: `Stalwart mis à jour vers 1.2.0.

- Nouveau : règles de messagerie côté serveur et listes d'expéditeurs bloqués et approuvés
- Nouveau : heures de travail et partage des disponibilités dans les calendriers
- Nouveau : comptes de salles et d'équipements avec réservation automatique ou manuelle
- Nouveau : accusés de lecture (notifications de disposition des messages)
- Nouveau : protocoles Microsoft Exchange pour Outlook, Apple Mail et les appareils ActiveSync, désactivés par défaut
- Corrections dans IMAP, JMAP, les calendriers, Sieve et la distribution du courrier, dont des nouveaux messages ignorés par certains clients IMAP et une synchronisation tardive des modifications dans Apple Mail
- Les rôles existants d'utilisateur, de groupe et d'administrateur reçoivent les permissions dont les nouvelles fonctions ont besoin, et la console d'administration passe à la version 2.1.1
- La console d'administration est incluse dans le paquet et ne se met à jour qu'avec lui

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.0)`,
  },
  migrations: {
    up: async ({ effects }) => {
      if (!(await storeJson.read((s) => s.bootstrapped).once())) return
      // Stalwart applies STALWART_UPDATE_ROLE_PERMISSIONS only on a normal start.
      await withMaintenanceStalwart(effects, 'roles', installConsoleBundle, {
        normalMode: true,
        env: { STALWART_UPDATE_ROLE_PERMISSIONS: 'true' },
      })
    },
    down: IMPOSSIBLE,
  },
})
