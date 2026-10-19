import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.16.27:0',
  releaseNotes: {
    en_US:
      'Updated Stalwart to 0.16.27. Fixes IMAP search results and delivery state updates, calendar time zones, OAuth loopback redirects and WebDAV names in Windows Explorer. Full release notes: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.27',
    es_ES:
      'Stalwart actualizado a 0.16.27. Corrige los resultados de búsqueda IMAP y las actualizaciones del estado de entrega, las zonas horarias del calendario, las redirecciones OAuth de bucle local y los nombres WebDAV en el Explorador de Windows. Notas completas de la versión: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.27',
    de_DE:
      'Stalwart auf 0.16.27 aktualisiert. Behebt Fehler bei IMAP-Suchergebnissen und Zustellstatusaktualisierungen, Kalenderzeitzonen, OAuth-Loopback-Weiterleitungen und WebDAV-Namen im Windows-Explorer. Vollständige Versionshinweise: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.27',
    pl_PL:
      'Zaktualizowano Stalwart do 0.16.27. Naprawiono wyniki wyszukiwania IMAP i aktualizacje stanu dostarczenia, strefy czasowe kalendarza, przekierowania OAuth na adres pętli zwrotnej oraz nazwy WebDAV w Eksploratorze Windows. Pełne informacje o wydaniu: https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.27',
    fr_FR:
      'Stalwart mis à jour vers 0.16.27. Corrige les résultats de recherche IMAP et les mises à jour de l’état de livraison, les fuseaux horaires du calendrier, les redirections OAuth de bouclage et les noms WebDAV dans l’Explorateur Windows. Notes de version complètes : https://github.com/stalwartlabs/stalwart/releases/tag/v0.16.27',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
