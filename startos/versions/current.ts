import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.1:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.1.1.

- New: masked email addresses no longer require an Enterprise license.
- Action required: if you manage DNS through Netcup, enter your Netcup CloudDNS API key in the new API key field of that DNS provider in the Admin Console. Only CloudDNS domains are supported.
- Fixes for IMAP clients that could skip newly delivered messages, Sieve sub-address matching, calendar invitations and recurring events, and concurrent WebDAV uploads.
- Security: hardened IMAP against memory exhaustion before login, and files shared over WebDAV can no longer run scripts in the browser.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.1)`,
    es_ES: `Stalwart actualizado a 1.1.1.

- Nuevo: las direcciones de correo enmascaradas ya no requieren una licencia Enterprise.
- Acción necesaria: si gestionas el DNS con Netcup, introduce tu clave de API de Netcup CloudDNS en el nuevo campo de clave de API de ese proveedor DNS en la consola de administración. Solo se admiten dominios CloudDNS.
- Correcciones para clientes IMAP que podían omitir mensajes recién entregados, la coincidencia de subdirecciones en Sieve, invitaciones de calendario y eventos recurrentes, y subidas WebDAV simultáneas.
- Seguridad: IMAP reforzado contra el agotamiento de memoria antes del inicio de sesión, y los archivos compartidos por WebDAV ya no pueden ejecutar scripts en el navegador.

[Notas de la versión completas](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.1)`,
    de_DE: `Stalwart auf 1.1.1 aktualisiert.

- Neu: Maskierte E-Mail-Adressen erfordern keine Enterprise-Lizenz mehr.
- Handlungsbedarf: Wenn du DNS über Netcup verwaltest, trage in der Admin-Konsole deinen Netcup-CloudDNS-API-Schlüssel in das neue API-Schlüssel-Feld dieses DNS-Anbieters ein. Unterstützt werden nur CloudDNS-Domains.
- Korrekturen für IMAP-Clients, die neu zugestellte Nachrichten überspringen konnten, für Sieve-Subadressen, Kalendereinladungen und wiederkehrende Termine sowie für gleichzeitige WebDAV-Uploads.
- Sicherheit: IMAP gegen Speichererschöpfung vor der Anmeldung gehärtet, und über WebDAV geteilte Dateien können im Browser keine Skripte mehr ausführen.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.1)`,
    pl_PL: `Zaktualizowano Stalwart do wersji 1.1.1.

- Nowość: maskowane adresy e-mail nie wymagają już licencji Enterprise.
- Wymagane działanie: jeśli zarządzasz DNS przez Netcup, wpisz klucz API Netcup CloudDNS w nowym polu klucza API tego dostawcy DNS w konsoli administracyjnej. Obsługiwane są tylko domeny CloudDNS.
- Poprawki dla klientów IMAP, którzy mogli pomijać nowo dostarczone wiadomości, dopasowywania podadresów w Sieve, zaproszeń kalendarza i wydarzeń cyklicznych oraz równoczesnych przesyłań WebDAV.
- Bezpieczeństwo: wzmocniono IMAP przed wyczerpaniem pamięci przed zalogowaniem, a pliki udostępniane przez WebDAV nie mogą już uruchamiać skryptów w przeglądarce.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.1)`,
    fr_FR: `Stalwart mis à jour vers 1.1.1.

- Nouveau : les adresses e-mail masquées ne nécessitent plus de licence Enterprise.
- Action requise : si vous gérez votre DNS avec Netcup, saisissez votre clé d'API Netcup CloudDNS dans le nouveau champ de clé d'API de ce fournisseur DNS dans la console d'administration. Seuls les domaines CloudDNS sont pris en charge.
- Corrections pour les clients IMAP qui pouvaient ignorer des messages nouvellement distribués, la correspondance des sous-adresses dans Sieve, les invitations de calendrier et les événements récurrents, et les envois WebDAV simultanés.
- Sécurité : IMAP renforcé contre l'épuisement de la mémoire avant la connexion, et les fichiers partagés via WebDAV ne peuvent plus exécuter de scripts dans le navigateur.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.1)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
