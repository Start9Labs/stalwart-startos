import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.1:0',
  releaseNotes: {
    en_US: `Updated Stalwart to 1.0.1. Fixes crashes under concurrent writes on ARM64, calendar invitation replies, ACME DNS-01 challenges for subdomains, and tenant isolation.

- If you use external telemetry, update dashboards and alerts for the renamed OpenTelemetry and Prometheus metrics. Configure serviceName, serviceNamespace and resourceAttributes instead of OTEL_* environment variables.
- With encryption at rest enabled, JMAP drafts and the Sent copy of messages submitted over JMAP are now stored unencrypted.

[Full release notes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.1)`,
    es_ES: `Stalwart actualizado a 1.0.1. Corrige fallos con escrituras simultáneas en ARM64, respuestas a invitaciones de calendario, desafíos ACME DNS-01 para subdominios y el aislamiento entre inquilinos.

- Si usas telemetría externa, actualiza los paneles y las alertas para los nuevos nombres de las métricas OpenTelemetry y Prometheus. Configura serviceName, serviceNamespace y resourceAttributes en lugar de las variables de entorno OTEL_*.
- Con el cifrado en reposo activado, los borradores JMAP y la copia en Enviados de los mensajes enviados por JMAP ahora se almacenan sin cifrar.

[Notas completas de la versión](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.1)`,
    de_DE: `Stalwart auf 1.0.1 aktualisiert. Behebt Abstürze bei gleichzeitigen Schreibzugriffen auf ARM64, Antworten auf Kalendereinladungen, ACME-DNS-01-Prüfungen für Subdomains und die Mandantentrennung.

- Bei externer Telemetrie müssen Dashboards und Alarme an die umbenannten OpenTelemetry- und Prometheus-Metriken angepasst werden. Konfigurieren Sie serviceName, serviceNamespace und resourceAttributes statt der OTEL_*-Umgebungsvariablen.
- Bei aktivierter Verschlüsselung ruhender Daten werden JMAP-Entwürfe und die Kopie gesendeter JMAP-Nachrichten im Gesendet-Ordner nun unverschlüsselt gespeichert.

[Vollständige Versionshinweise](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.1)`,
    pl_PL: `Zaktualizowano Stalwart do 1.0.1. Naprawiono awarie przy równoczesnych zapisach na ARM64, odpowiedzi na zaproszenia kalendarza, weryfikację ACME DNS-01 dla subdomen oraz izolację dzierżawców.

- Jeśli używasz zewnętrznej telemetrii, zaktualizuj pulpity i alerty zgodnie ze zmienionymi nazwami metryk OpenTelemetry i Prometheus. Skonfiguruj serviceName, serviceNamespace i resourceAttributes zamiast zmiennych środowiskowych OTEL_*.
- Przy włączonym szyfrowaniu danych w spoczynku szkice JMAP i kopie wiadomości wysłanych przez JMAP w folderze Wysłane są teraz przechowywane bez szyfrowania.

[Pełne informacje o wydaniu](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.1)`,
    fr_FR: `Stalwart mis à jour vers 1.0.1. Corrige les plantages lors d’écritures simultanées sur ARM64, les réponses aux invitations de calendrier, les défis ACME DNS-01 pour les sous-domaines et l’isolation des locataires.

- Si vous utilisez une télémétrie externe, adaptez les tableaux de bord et les alertes aux nouveaux noms des métriques OpenTelemetry et Prometheus. Configurez serviceName, serviceNamespace et resourceAttributes à la place des variables d’environnement OTEL_*.
- Lorsque le chiffrement au repos est activé, les brouillons JMAP et la copie des messages envoyés par JMAP dans le dossier Envoyés sont désormais stockés sans chiffrement.

[Notes de version complètes](https://github.com/stalwartlabs/stalwart/releases/tag/v1.0.1)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
