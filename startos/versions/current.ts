import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.0.0 with attachment and file full-text search, IMAP metadata, expanded OAuth controls, and bug and security fixes. Updated start-sdk to 3.1.1. Removed the temporary CA-store layer; upstream's image now excludes the compromised eMudhra root.

Console and Account Manager login require HTTPS on the hostname chosen at setup; arbitrary StartOS addresses are not supported for login. Bootstrap, local API probes and ACME retry handling are adapted to the new server API.

**Fresh installations only.** This release cannot update existing 0.16.x installations or restore their backups: Stalwart 1.0 requires an explicit database and settings conversion, which is not integrated into this package. Do not uninstall an existing mail server to update it. OAuth clients must sign in again after migration, DAV clients resynchronize, and search indexes must rebuild.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0) · [Upstream migration documentation](https://github.com/stalwartlabs/stalwart-migrate)`,
    es_ES: `Stalwart actualizado a 1.0.0 con búsqueda de texto completo en adjuntos y archivos, metadatos IMAP, más controles OAuth y correcciones de errores y seguridad. start-sdk actualizado a 3.1.1. Se elimina la capa temporal de certificados; la imagen de origen ya excluye la raíz eMudhra comprometida.

El inicio de sesión en la consola y el gestor de cuentas requiere HTTPS en el nombre de host elegido durante la configuración; las direcciones arbitrarias de StartOS no son compatibles. Se adaptan la inicialización, las comprobaciones locales de la API y los reintentos ACME a la nueva API del servidor.

**Solo instalaciones nuevas.** Esta versión no permite actualizar instalaciones 0.16.x ni restaurar sus copias de seguridad: Stalwart 1.0 requiere una conversión explícita de la base de datos y los ajustes, no integrada en este paquete. No desinstales un servidor de correo existente para actualizarlo. Tras una migración, los clientes OAuth deben iniciar sesión de nuevo, los clientes DAV se resincronizan y los índices de búsqueda deben reconstruirse.

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0) · [Documentación de migración del proyecto](https://github.com/stalwartlabs/stalwart-migrate)`,
    de_DE: `Stalwart auf 1.0.0 aktualisiert: Volltextsuche in Anhängen und Dateien, IMAP-Metadaten, erweiterte OAuth-Steuerung sowie Fehler- und Sicherheitskorrekturen. start-sdk auf 3.1.1 aktualisiert. Die temporäre Zertifikatsschicht entfällt; das Upstream-Image enthält das kompromittierte eMudhra-Wurzelzertifikat nicht mehr.

Die Anmeldung an Konsole und Kontoverwaltung erfordert HTTPS unter dem bei der Einrichtung gewählten Hostnamen; beliebige StartOS-Adressen werden nicht unterstützt. Initialisierung, lokale API-Prüfungen und ACME-Wiederholungen sind an die neue Server-API angepasst.

**Nur für Neuinstallationen.** Bestehende 0.16.x-Installationen können weder aktualisiert noch ihre Sicherungen wiederhergestellt werden: Stalwart 1.0 erfordert eine ausdrückliche Konvertierung der Datenbank und Einstellungen, die dieses Paket nicht integriert. Einen bestehenden Mailserver nicht zum Aktualisieren deinstallieren. Nach einer Migration müssen sich OAuth-Clients erneut anmelden, DAV-Clients synchronisieren erneut und Suchindizes werden neu aufgebaut.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0) · [Upstream-Migrationsdokumentation](https://github.com/stalwartlabs/stalwart-migrate)`,
    pl_PL: `Zaktualizowano Stalwart do 1.0.0: wyszukiwanie pełnotekstowe załączników i plików, metadane IMAP, rozszerzone opcje OAuth oraz poprawki błędów i bezpieczeństwa. Zaktualizowano start-sdk do 3.1.1. Usunięto tymczasową warstwę certyfikatów; obraz źródłowy nie zawiera już przejętego certyfikatu głównego eMudhra.

Logowanie do konsoli i menedżera kont wymaga HTTPS pod nazwą hosta wybraną podczas konfiguracji; dowolne adresy StartOS nie są obsługiwane. Dostosowano inicjalizację, lokalne sprawdzanie API i ponawianie ACME do nowego API serwera.

**Tylko nowe instalacje.** Ta wersja nie umożliwia aktualizacji instalacji 0.16.x ani przywracania ich kopii zapasowych: Stalwart 1.0 wymaga jawnej konwersji bazy danych i ustawień, której ten pakiet nie integruje. Nie odinstalowuj działającego serwera poczty w celu aktualizacji. Po migracji klienci OAuth muszą zalogować się ponownie, klienci DAV ponownie synchronizują dane, a indeksy wyszukiwania wymagają odbudowy.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0) · [Dokumentacja migracji projektu](https://github.com/stalwartlabs/stalwart-migrate)`,
    fr_FR: `Stalwart mis à jour vers 1.0.0 : recherche plein texte dans les pièces jointes et fichiers, métadonnées IMAP, contrôles OAuth étendus et correctifs de sécurité et de bogues. start-sdk mis à jour vers 3.1.1. La couche temporaire de certificats est supprimée ; l’image amont exclut désormais la racine eMudhra compromise.

La connexion à la console et au gestionnaire de comptes exige HTTPS sur le nom d’hôte choisi lors de la configuration ; les adresses StartOS arbitraires ne sont pas prises en charge. L’initialisation, les vérifications locales de l’API et les tentatives ACME sont adaptées à la nouvelle API du serveur.

**Nouvelles installations uniquement.** Cette version ne permet ni de mettre à jour les installations 0.16.x ni de restaurer leurs sauvegardes : Stalwart 1.0 exige une conversion explicite de la base de données et des paramètres, non intégrée dans ce paquet. Ne désinstallez pas un serveur de messagerie existant pour le mettre à jour. Après une migration, les clients OAuth doivent se reconnecter, les clients DAV se resynchronisent et les index de recherche doivent être reconstruits.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.0) · [Documentation de migration amont](https://github.com/stalwartlabs/stalwart-migrate)`,
  },
  migrations: {
    up: IMPOSSIBLE,
    down: IMPOSSIBLE,
  },
})
