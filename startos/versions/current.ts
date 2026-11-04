import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.3:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.0.3 with blob encryption at rest and Zstandard compression, fixes for Apple Mail searches, JMAP notifications and OpenID Connect sign-in, and a security fix ensuring role changes invalidate cached access tokens.

- On existing installations, new permissions are not added to default roles automatically. To use the features they control, add the missing permissions to the roles in the Admin Console; see [default roles on upgraded servers](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Third-party OAuth apps that manage app passwords, API keys or account settings must request the new security, settings or full scopes. Allow the required scopes on the OAuth client in Stalwart, or create and assign them in your external OpenID Connect provider. The WebUI needs no action. Scope names and details are in the release notes below.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.3)`,
    es_ES: `Stalwart actualizado a 1.0.3 con cifrado en reposo y compresión Zstandard de blobs, correcciones de búsquedas en Apple Mail, notificaciones JMAP e inicio de sesión OpenID Connect, y una corrección de seguridad que invalida los tokens de acceso en caché al modificar roles.

- En instalaciones existentes, los permisos nuevos no se añaden automáticamente a los roles predeterminados. Para usar las funciones que controlan, añade los permisos que faltan a los roles en la consola de administración; consulta [los roles predeterminados en servidores actualizados](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Las aplicaciones OAuth de terceros que gestionan contraseñas de aplicación, claves API o ajustes de cuenta deben solicitar los nuevos ámbitos security, settings o full. Permite los ámbitos necesarios en el cliente OAuth de Stalwart, o créalos y asígnalos en tu proveedor OpenID Connect externo. La consola web no requiere cambios. Los nombres de los ámbitos y los detalles figuran en las notas de la versión enlazadas abajo.

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.3)`,
    de_DE: `Stalwart auf 1.0.3 aktualisiert: Blob-Verschlüsselung im Ruhezustand und Zstandard-Komprimierung, Korrekturen für Apple-Mail-Suchen, JMAP-Benachrichtigungen und OpenID-Connect-Anmeldungen sowie eine Sicherheitskorrektur, die zwischengespeicherte Zugriffstoken bei Rollenänderungen ungültig macht.

- Bei bestehenden Installationen werden neue Berechtigungen nicht automatisch zu Standardrollen hinzugefügt. Die fehlenden Berechtigungen in der Admin-Konsole zu den Rollen hinzufügen, um die betreffenden Funktionen zu nutzen; siehe [Standardrollen auf aktualisierten Servern](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- OAuth-Anwendungen von Drittanbietern, die App-Passwörter, API-Schlüssel oder Kontoeinstellungen verwalten, müssen die neuen Scopes security, settings oder full anfordern. Die benötigten Scopes am OAuth-Client in Stalwart erlauben oder beim externen OpenID-Connect-Anbieter erstellen und zuweisen. Für die Webkonsole ist nichts zu tun. Die vollständigen Scope-Namen und weitere Einzelheiten stehen in den unten verlinkten Versionshinweisen.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.3)`,
    pl_PL: `Zaktualizowano Stalwart do 1.0.3: szyfrowanie przechowywanych blobów i kompresja Zstandard, poprawki wyszukiwania w Apple Mail, powiadomień JMAP i logowania OpenID Connect oraz poprawka bezpieczeństwa unieważniająca buforowane tokeny dostępu po zmianie ról.

- W istniejących instalacjach nowe uprawnienia nie są automatycznie dodawane do ról domyślnych. Aby korzystać z kontrolowanych przez nie funkcji, dodaj brakujące uprawnienia do ról w konsoli administracyjnej; zobacz [role domyślne na zaktualizowanych serwerach](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Aplikacje OAuth innych firm zarządzające hasłami aplikacji, kluczami API lub ustawieniami konta muszą żądać nowych zakresów security, settings lub full. Zezwól na wymagane zakresy w kliencie OAuth w Stalwart albo utwórz je i przypisz u zewnętrznego dostawcy OpenID Connect. Konsola internetowa nie wymaga zmian. Pełne nazwy zakresów i szczegóły znajdują się w informacjach o wydaniu poniżej.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.3)`,
    fr_FR: `Stalwart mis à jour vers 1.0.3 : chiffrement au repos et compression Zstandard des blobs, correctifs pour les recherches Apple Mail, les notifications JMAP et la connexion OpenID Connect, et correctif de sécurité invalidant les jetons d’accès en cache lors des modifications de rôles.

- Sur les installations existantes, les nouvelles permissions ne sont pas ajoutées automatiquement aux rôles par défaut. Pour utiliser les fonctions concernées, ajoutez les permissions manquantes aux rôles dans la console d’administration ; consultez [les rôles par défaut sur les serveurs mis à jour](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Les applications OAuth tierces qui gèrent les mots de passe d’application, les clés API ou les paramètres de compte doivent demander les nouvelles portées security, settings ou full. Autorisez les portées nécessaires sur le client OAuth dans Stalwart, ou créez-les et attribuez-les chez votre fournisseur OpenID Connect externe. La console web ne nécessite aucune action. Les noms complets des portées et les détails figurent dans les notes de version ci-dessous.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.3)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
