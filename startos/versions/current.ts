import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.1:2',
  releaseNotes: {
    en_US:
      'New action: Unblock IP Addresses removes addresses Stalwart has blocked, such as your own after too many failed sign-ins.',
    es_ES:
      'Nueva acción: Desbloquear direcciones IP elimina las direcciones que Stalwart ha bloqueado, como la tuya tras demasiados inicios de sesión fallidos.',
    de_DE:
      'Neue Aktion: IP-Adressen entsperren entfernt Adressen, die Stalwart gesperrt hat, etwa deine eigene nach zu vielen fehlgeschlagenen Anmeldungen.',
    pl_PL:
      'Nowa akcja: Odblokuj adresy IP usuwa adresy zablokowane przez Stalwart, na przykład Twój własny po zbyt wielu nieudanych logowaniach.',
    fr_FR:
      "Nouvelle action : Débloquer des adresses IP supprime les adresses que Stalwart a bloquées, comme la vôtre après trop d'échecs de connexion.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
