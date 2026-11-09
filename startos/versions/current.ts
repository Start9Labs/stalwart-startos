import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.0:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.1.0 with passwordless passkey sign-in for internal-directory accounts, fixes for duplicate or delayed deliveries after a restart, calendar invitation replies and DKIM key management. Requires StartOS 0.4.1 or later.

- On existing installations, sign in to the Admin Console with the recovery administrator (admin) and add the missing sysPasskey* permissions to the default roles before using passkeys; see [default roles on upgraded servers](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Manage passkeys under Account > Credentials, using HTTPS on your setup hostname. Passkeys are a passwordless sign-in method, not a second factor: passkey sign-in does not ask for a TOTP code.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.0)`,
    es_ES: `Stalwart actualizado a 1.1.0 con inicio de sesión sin contraseña mediante claves de acceso para cuentas del directorio interno y correcciones de entregas duplicadas o retrasadas tras reiniciar, respuestas a invitaciones de calendario y gestión de claves DKIM. Requiere StartOS 0.4.1 o posterior.

- En instalaciones existentes, inicia sesión en la consola de administración con el administrador de recuperación (admin) y añade los permisos sysPasskey* que faltan a los roles predeterminados antes de usar claves de acceso; consulta [los roles predeterminados en servidores actualizados](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Gestiona las claves de acceso en Account > Credentials, usando HTTPS en el nombre de host elegido durante la configuración. Las claves de acceso sustituyen el inicio de sesión con contraseña, no son un segundo factor: al usarlas no se solicita un código TOTP.

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.0)`,
    de_DE: `Stalwart auf 1.1.0 aktualisiert: passwortlose Passkey-Anmeldung für Konten im internen Verzeichnis sowie Korrekturen für doppelte oder verzögerte Zustellungen nach einem Neustart, Antworten auf Kalendereinladungen und die DKIM-Schlüsselverwaltung. Erfordert StartOS 0.4.1 oder neuer.

- Bei bestehenden Installationen mit dem Wiederherstellungsadministrator (admin) an der Admin-Konsole anmelden und vor der Passkey-Nutzung die fehlenden sysPasskey*-Berechtigungen zu den Standardrollen hinzufügen; siehe [Standardrollen auf aktualisierten Servern](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Passkeys unter Account > Credentials über HTTPS am bei der Einrichtung gewählten Hostnamen verwalten. Passkeys ersetzen die Passwortanmeldung und sind kein zweiter Faktor: Bei der Passkey-Anmeldung wird kein TOTP-Code abgefragt.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.0)`,
    pl_PL: `Zaktualizowano Stalwart do 1.1.0: logowanie bez hasła za pomocą kluczy dostępu dla kont w katalogu wewnętrznym oraz poprawki zduplikowanych lub opóźnionych dostaw po ponownym uruchomieniu, odpowiedzi na zaproszenia kalendarza i zarządzania kluczami DKIM. Wymaga StartOS 0.4.1 lub nowszego.

- W istniejących instalacjach zaloguj się do konsoli administracyjnej jako administrator odzyskiwania (admin) i dodaj brakujące uprawnienia sysPasskey* do ról domyślnych przed użyciem kluczy dostępu; zobacz [role domyślne na zaktualizowanych serwerach](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Zarządzaj kluczami dostępu w Account > Credentials przez HTTPS pod nazwą hosta wybraną podczas konfiguracji. Klucze dostępu zastępują logowanie hasłem i nie są drugim składnikiem: przy logowaniu kluczem dostępu kod TOTP nie jest wymagany.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.0)`,
    fr_FR: `Stalwart mis à jour vers 1.1.0 : connexion sans mot de passe par clés d’accès pour les comptes de l’annuaire interne, correctifs pour les livraisons en double ou retardées après un redémarrage, les réponses aux invitations de calendrier et la gestion des clés DKIM. Nécessite StartOS 0.4.1 ou ultérieur.

- Sur les installations existantes, connectez-vous à la console d’administration avec l’administrateur de récupération (admin) et ajoutez les permissions sysPasskey* manquantes aux rôles par défaut avant d’utiliser les clés d’accès ; consultez [les rôles par défaut sur les serveurs mis à jour](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).
- Gérez les clés d’accès sous Account > Credentials, en HTTPS sur le nom d’hôte choisi lors de la configuration. Les clés d’accès remplacent la connexion par mot de passe et ne sont pas un second facteur : la connexion par clé d’accès ne demande pas de code TOTP.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.1.0)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
