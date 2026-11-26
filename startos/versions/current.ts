import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.2.1:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.2.1.

**Security**

- An app password or API key can no longer change the account password or remove two-factor authentication
- A user a mailbox is shared with can no longer change who else it is shared with unless allowed to share it
- A shared mailbox name can no longer inject responses into another user's IMAP session
- A crafted signed message can no longer crash the server

**Fixes**

- Thunderbird and Evolution no longer skip newly arrived messages
- Outlook for iOS and Android can send mail, iOS Mail server search works again, and iOS Calendar can create events again
- Apple Mail syncs the folder list over Exchange without crashing, and Outlook in cached mode shows the body of messages with large HTML parts
- Invitation emails show the time zone of times given in UTC or a fixed offset
- Fixes to Sieve scripts, mail rules and JMAP

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.1)`,
    es_ES: `Stalwart actualizado a 1.2.1.

**Seguridad**

- Una contraseña de aplicación o una clave de API ya no puede cambiar la contraseña de la cuenta ni quitar la autenticación de dos factores
- Un usuario con quien se comparte un buzón ya no puede cambiar con quién más se comparte salvo que tenga permiso para compartirlo
- El nombre de un buzón compartido ya no puede inyectar respuestas en la sesión IMAP de otro usuario
- Un mensaje firmado manipulado ya no puede bloquear el servidor

**Correcciones**

- Thunderbird y Evolution ya no omiten los mensajes recién llegados
- Outlook para iOS y Android puede enviar correo, la búsqueda en el servidor de iOS Mail vuelve a funcionar e iOS Calendar vuelve a poder crear eventos
- Apple Mail sincroniza la lista de carpetas por Exchange sin bloquearse, y Outlook en modo caché muestra el cuerpo de los mensajes con partes HTML grandes
- Los correos de invitación muestran la zona horaria de las horas dadas en UTC o con un desfase fijo
- Correcciones en scripts Sieve, reglas de correo y JMAP

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.1)`,
    de_DE: `Stalwart auf 1.2.1 aktualisiert.

**Sicherheit**

- Ein App-Passwort oder API-Schlüssel kann das Kontopasswort nicht mehr ändern und die Zwei-Faktor-Authentifizierung nicht mehr entfernen
- Ein Benutzer, für den ein Postfach freigegeben ist, kann nicht mehr ändern, für wen es noch freigegeben ist, sofern er es nicht freigeben darf
- Der Name eines freigegebenen Postfachs kann keine Antworten mehr in die IMAP-Sitzung eines anderen Benutzers einschleusen
- Eine manipulierte signierte Nachricht kann den Server nicht mehr zum Absturz bringen

**Korrekturen**

- Thunderbird und Evolution überspringen neu eingetroffene Nachrichten nicht mehr
- Outlook für iOS und Android kann Mails senden, die Serversuche in iOS Mail funktioniert wieder, und der iOS-Kalender kann wieder Termine anlegen
- Apple Mail synchronisiert die Ordnerliste über Exchange ohne Absturz, und Outlook im Cache-Modus zeigt den Text von Nachrichten mit großen HTML-Teilen
- Einladungs-Mails zeigen die Zeitzone von Zeiten in UTC oder mit festem Versatz
- Korrekturen bei Sieve-Skripten, Mailregeln und JMAP

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.1)`,
    pl_PL: `Zaktualizowano Stalwart do 1.2.1.

**Bezpieczeństwo**

- Hasło aplikacji ani klucz API nie mogą już zmienić hasła konta ani usunąć uwierzytelniania dwuskładnikowego
- Użytkownik, któremu udostępniono skrzynkę, nie może już zmienić, komu jeszcze jest udostępniona, jeśli nie ma prawa jej udostępniać
- Nazwa udostępnionej skrzynki nie może już wstrzykiwać odpowiedzi do sesji IMAP innego użytkownika
- Spreparowana podpisana wiadomość nie może już zawiesić serwera

**Poprawki**

- Thunderbird i Evolution nie pomijają już nowo przychodzących wiadomości
- Outlook na iOS i Androida może wysyłać pocztę, wyszukiwanie na serwerze w iOS Mail znów działa, a Kalendarz iOS znów może tworzyć wydarzenia
- Apple Mail synchronizuje listę folderów przez Exchange bez awarii, a Outlook w trybie buforowanym pokazuje treść wiadomości z dużymi częściami HTML
- Wiadomości z zaproszeniami pokazują strefę czasową godzin podanych w UTC lub ze stałym przesunięciem
- Poprawki w skryptach Sieve, regułach poczty i JMAP

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.1)`,
    fr_FR: `Stalwart mis à jour vers 1.2.1.

**Sécurité**

- Un mot de passe d'application ou une clé d'API ne peut plus changer le mot de passe du compte ni retirer l'authentification à deux facteurs
- Un utilisateur avec qui une boîte aux lettres est partagée ne peut plus changer avec qui elle est partagée sauf s'il a le droit de la partager
- Le nom d'une boîte aux lettres partagée ne peut plus injecter de réponses dans la session IMAP d'un autre utilisateur
- Un message signé malveillant ne peut plus faire planter le serveur

**Corrections**

- Thunderbird et Evolution n'ignorent plus les messages nouvellement arrivés
- Outlook pour iOS et Android peut envoyer du courrier, la recherche sur le serveur d'iOS Mail fonctionne à nouveau et le Calendrier iOS peut de nouveau créer des événements
- Apple Mail synchronise la liste des dossiers via Exchange sans planter, et Outlook en mode mis en cache affiche le corps des messages comportant de grandes parties HTML
- Les e-mails d'invitation indiquent le fuseau horaire des heures données en UTC ou avec un décalage fixe
- Corrections dans les scripts Sieve, les règles de messagerie et JMAP

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.2.1)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
