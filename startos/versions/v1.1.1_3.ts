import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { configJson, storeJson } from '../fileModels/store.json'
import { configure } from '../init/bootstrap'
import { withMaintenanceStalwart } from '../maintenance'
import { jmap, jmapQuery } from '../utils'

export const v_1_1_1_3 = VersionInfo.of({
  version: '1.1.1:3',
  releaseNotes: {
    en_US: `- New action: Unblock IP Addresses removes addresses Stalwart has blocked, such as your own after too many failed sign-ins.
- If you start Stalwart while it is still finishing its first-time setup, it now waits for setup to finish and then starts.`,
    es_ES: `- Nueva acción: Desbloquear direcciones IP elimina las direcciones que Stalwart ha bloqueado, como la tuya tras demasiados inicios de sesión fallidos.
- Si inicias Stalwart mientras aún termina su configuración inicial, ahora espera a que la configuración termine y luego se inicia.`,
    de_DE: `- Neue Aktion: IP-Adressen entsperren entfernt Adressen, die Stalwart gesperrt hat, etwa deine eigene nach zu vielen fehlgeschlagenen Anmeldungen.
- Startest du Stalwart, während die Ersteinrichtung noch läuft, wartet es jetzt, bis die Einrichtung abgeschlossen ist, und startet dann.`,
    pl_PL: `- Nowa akcja: Odblokuj adresy IP usuwa adresy zablokowane przez Stalwart, na przykład Twój własny po zbyt wielu nieudanych logowaniach.
- Jeśli uruchomisz Stalwart, gdy wciąż kończy wstępną konfigurację, teraz poczeka na jej zakończenie, a potem się uruchomi.`,
    fr_FR: `- Nouvelle action : Débloquer des adresses IP supprime les adresses que Stalwart a bloquées, comme la vôtre après trop d'échecs de connexion.
- Si vous démarrez Stalwart alors qu'il termine encore sa configuration initiale, il attend désormais la fin de la configuration, puis démarre.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const store = await storeJson.read().once()
      if (
        !store?.hostname ||
        !store.domain ||
        (await configJson.read().once()) === null
      ) {
        return
      }
      const { hostname, domain } = store
      // Stalwart provisions its default listeners only on a normal start that finds none.
      let consoleOnly = false
      await withMaintenanceStalwart(effects, 'repair', async (api) => {
        const listeners = await jmapQuery<{ id: string; name: string }>(
          api,
          'NetworkListener',
          ['name'],
        )
        consoleOnly = listeners.every((l) => l.name === 'console')
        if (consoleOnly && listeners.length) {
          await jmap(api, [
            [
              'x:NetworkListener/set',
              { destroy: listeners.map((l) => l.id) },
              'c1',
            ],
          ])
        }
      })
      if (consoleOnly) {
        await withMaintenanceStalwart(
          effects,
          'configure',
          (api) => configure(api, hostname, domain),
          { normalMode: true },
        )
      }
      await storeJson.merge(effects, { bootstrapped: true })
    },
    down: IMPOSSIBLE,
  },
})
