import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.2:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.0.2 with expanded OpenPGP and S/MIME support, an outbound encryption gateway, and fixes for DKIM signatures, Outlook IMAP access, JMAP and web console downloads. App passwords and API keys can no longer be used for interactive sign-in; use the account password and two-factor authentication instead.

**Encryption settings require attention after updating**

- Accounts with encryption at rest enabled are reset to Disabled. Select each account's public key again in its encryption settings to re-enable it; new messages are stored unencrypted until then. Existing encrypted messages and registered public keys are unaffected.
- The server-wide Email.encryptAtRest setting is replaced by Encryption.atRestEnable, enabled by default. If you previously disabled it, disable it again. Email.encryptOnAppend moves to each account's encryptOnAppend setting.

[Full upstream changelog](https://github.com/stalwartlabs/stalwart/blob/v1.0.2/CHANGELOG.md#102---2026-11-02)`,
    es_ES: `Stalwart actualizado a 1.0.2 con soporte ampliado de OpenPGP y S/MIME, una pasarela de cifrado saliente y correcciones de firmas DKIM, acceso IMAP de Outlook, JMAP y descargas de la consola web. Las contraseñas de aplicación y las claves API ya no permiten iniciar sesión de forma interactiva; utiliza la contraseña de la cuenta y la autenticación de dos factores.

**Revisa la configuración de cifrado después de actualizar**

- Las cuentas con cifrado en reposo activado pasan a Disabled. Vuelve a seleccionar la clave pública de cada cuenta en su configuración de cifrado para reactivarlo; hasta entonces, los mensajes nuevos se almacenan sin cifrar. Los mensajes ya cifrados y las claves públicas registradas no se ven afectados.
- El ajuste global Email.encryptAtRest se sustituye por Encryption.atRestEnable, activado por defecto. Si antes lo habías desactivado, desactívalo de nuevo. Email.encryptOnAppend pasa al ajuste encryptOnAppend de cada cuenta.

[Registro completo de cambios](https://github.com/stalwartlabs/stalwart/blob/v1.0.2/CHANGELOG.md#102---2026-11-02)`,
    de_DE: `Stalwart auf 1.0.2 aktualisiert: erweiterte OpenPGP- und S/MIME-Unterstützung, ein Gateway zur Verschlüsselung ausgehender Nachrichten sowie Korrekturen für DKIM-Signaturen, Outlook-IMAP-Zugriff, JMAP und Downloads der Webkonsole. App-Passwörter und API-Schlüssel sind für interaktive Anmeldungen nicht mehr zulässig; stattdessen das Kontopasswort und die Zwei-Faktor-Authentifizierung verwenden.

**Verschlüsselungseinstellungen nach dem Update prüfen**

- Konten mit aktivierter Verschlüsselung gespeicherter Nachrichten werden auf Disabled zurückgesetzt. Den öffentlichen Schlüssel jedes Kontos in dessen Verschlüsselungseinstellungen erneut auswählen, um sie wieder zu aktivieren; bis dahin werden neue Nachrichten unverschlüsselt gespeichert. Bereits verschlüsselte Nachrichten und registrierte öffentliche Schlüssel bleiben unverändert.
- Die serverweite Einstellung Email.encryptAtRest wird durch Encryption.atRestEnable ersetzt und ist standardmäßig aktiviert. Falls sie zuvor deaktiviert war, erneut deaktivieren. Email.encryptOnAppend wird zur Einstellung encryptOnAppend des jeweiligen Kontos.

[Vollständiges Änderungsprotokoll](https://github.com/stalwartlabs/stalwart/blob/v1.0.2/CHANGELOG.md#102---2026-11-02)`,
    pl_PL: `Zaktualizowano Stalwart do 1.0.2: rozszerzona obsługa OpenPGP i S/MIME, brama szyfrowania poczty wychodzącej oraz poprawki podpisów DKIM, dostępu IMAP z Outlooka, JMAP i pobierania konsoli internetowej. Hasła aplikacji i klucze API nie służą już do logowania interaktywnego; użyj hasła konta i uwierzytelniania dwuskładnikowego.

**Po aktualizacji sprawdź ustawienia szyfrowania**

- Konta z włączonym szyfrowaniem przechowywanych wiadomości zostają przełączone na Disabled. Ponownie wybierz klucz publiczny każdego konta w jego ustawieniach szyfrowania, aby je przywrócić; do tego czasu nowe wiadomości są zapisywane bez szyfrowania. Istniejące zaszyfrowane wiadomości i zarejestrowane klucze publiczne pozostają bez zmian.
- Ustawienie serwerowe Email.encryptAtRest zostaje zastąpione przez Encryption.atRestEnable, domyślnie włączone. Jeśli wcześniej je wyłączono, wyłącz je ponownie. Email.encryptOnAppend przeniesiono do ustawienia encryptOnAppend każdego konta.

[Pełny dziennik zmian](https://github.com/stalwartlabs/stalwart/blob/v1.0.2/CHANGELOG.md#102---2026-11-02)`,
    fr_FR: `Stalwart mis à jour vers 1.0.2 : prise en charge étendue d’OpenPGP et de S/MIME, passerelle de chiffrement sortant et correctifs pour les signatures DKIM, l’accès IMAP d’Outlook, JMAP et le téléchargement de la console web. Les mots de passe d’application et les clés API ne permettent plus la connexion interactive ; utilisez le mot de passe du compte et l’authentification à deux facteurs.

**Vérifiez les paramètres de chiffrement après la mise à jour**

- Les comptes dont le chiffrement au repos était activé passent à Disabled. Sélectionnez à nouveau la clé publique de chaque compte dans ses paramètres de chiffrement pour le réactiver ; les nouveaux messages sont stockés sans chiffrement jusque-là. Les messages déjà chiffrés et les clés publiques enregistrées restent inchangés.
- Le paramètre global Email.encryptAtRest est remplacé par Encryption.atRestEnable, activé par défaut. Si vous l’aviez désactivé, désactivez-le à nouveau. Email.encryptOnAppend devient le paramètre encryptOnAppend de chaque compte.

[Journal complet des modifications](https://github.com/stalwartlabs/stalwart/blob/v1.0.2/CHANGELOG.md#102---2026-11-02)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
