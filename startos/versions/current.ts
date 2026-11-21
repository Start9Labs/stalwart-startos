import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { hashPassword } from '../utils'

export const current = VersionInfo.of({
  version: '1.1.1:1',
  releaseNotes: {
    en_US: `The Admin Console and Account Manager now accept sign-in at every HTTPS address enabled on their interfaces, including the server's \`.local\`, LAN IP and HTTPS \`.onion\` addresses. Enable or disable addresses on the Interfaces tab to choose where sign-in works. Enabling or disabling a sign-in address restarts Stalwart, which interrupts mail for a few seconds.

- Your admin username (\`admin\`) and password are unchanged. They now sign in to the administrator account in Stalwart's default email domain.
- Set Admin Password also turns off two-factor authentication on that account, so the new password alone signs in.
- StartOS keeps only a hash of your admin password. Save the password Set Admin Password shows you.
- Show DNS Records asks for your admin password.
- The Admin Console and Account Manager move to their own addresses, on port 8443, and never appear on your public domain at port 443. Update your bookmarks.
- A new JMAP, Calendars & Contacts interface shows where mail, calendar and contacts apps connect.`,
    es_ES: `La consola de administración y el gestor de cuentas ahora permiten iniciar sesión en todas las direcciones HTTPS habilitadas en sus interfaces, incluidas las direcciones \`.local\`, IP de la LAN y \`.onion\` HTTPS del servidor. Habilita o deshabilita direcciones en la pestaña Interfaces para elegir dónde se puede iniciar sesión. Habilitar o deshabilitar una dirección de inicio de sesión reinicia Stalwart, lo que interrumpe el correo unos segundos.

- Tu nombre de usuario de administrador (\`admin\`) y contraseña no cambian. Ahora inician sesión en la cuenta de administrador del dominio de correo predeterminado de Stalwart.
- Establecer contraseña de administrador también desactiva la autenticación en dos pasos de esa cuenta, para que baste la nueva contraseña para iniciar sesión.
- StartOS solo guarda un hash de tu contraseña de administrador. Guarda la contraseña que te muestra Establecer contraseña de administrador.
- Mostrar registros DNS pide tu contraseña de administrador.
- La consola de administración y el gestor de cuentas pasan a tener sus propias direcciones, en el puerto 8443, y nunca aparecen en tu dominio público en el puerto 443. Actualiza tus marcadores.
- La nueva interfaz JMAP, calendarios y contactos muestra dónde se conectan las aplicaciones de correo, calendario y contactos.`,
    de_DE: `Die Admin-Konsole und die Kontoverwaltung akzeptieren die Anmeldung jetzt an jeder HTTPS-Adresse, die auf ihren Schnittstellen aktiviert ist, einschließlich der \`.local\`-Adresse, der LAN-IP und der HTTPS-\`.onion\`-Adresse des Servers. Aktiviere oder deaktiviere Adressen im Tab Schnittstellen, um festzulegen, wo die Anmeldung funktioniert. Das Aktivieren oder Deaktivieren einer Anmeldeadresse startet Stalwart neu und unterbricht den Mailverkehr für einige Sekunden.

- Dein Administrator-Benutzername (\`admin\`) und -Passwort bleiben unverändert. Sie melden jetzt am Administratorkonto in Stalwarts Standard-E-Mail-Domain an.
- Administratorpasswort festlegen deaktiviert außerdem die Zwei-Faktor-Authentifizierung dieses Kontos, sodass das neue Passwort allein für die Anmeldung genügt.
- StartOS speichert nur einen Hash deines Administratorpassworts. Bewahre das Passwort auf, das dir Administratorpasswort festlegen anzeigt.
- DNS-Einträge anzeigen fragt nach deinem Administratorpasswort.
- Die Admin-Konsole und die Kontoverwaltung erhalten eigene Adressen auf Port 8443 und erscheinen nie auf deiner öffentlichen Domain an Port 443. Aktualisiere deine Lesezeichen.
- Die neue Schnittstelle JMAP, Kalender & Kontakte zeigt, wo sich Mail-, Kalender- und Kontakt-Apps verbinden.`,
    pl_PL: `Konsola administracyjna i menedżer kont pozwalają teraz zalogować się pod każdym adresem HTTPS włączonym na ich interfejsach, w tym pod adresem \`.local\`, adresem IP w sieci LAN i adresem \`.onion\` HTTPS serwera. Włączaj lub wyłączaj adresy na karcie Interfejsy, aby wybrać, gdzie można się zalogować. Włączenie lub wyłączenie adresu logowania uruchamia Stalwart ponownie, co na kilka sekund przerywa obsługę poczty.

- Nazwa użytkownika administratora (\`admin\`) i hasło się nie zmieniają. Logują teraz do konta administratora w domyślnej domenie poczty Stalwart.
- Ustaw hasło administratora wyłącza też uwierzytelnianie dwuskładnikowe na tym koncie, aby do zalogowania wystarczyło samo nowe hasło.
- StartOS przechowuje tylko skrót hasła administratora. Zapisz hasło, które pokazuje Ustaw hasło administratora.
- Pokaż rekordy DNS prosi o hasło administratora.
- Konsola administracyjna i menedżer kont mają teraz własne adresy, na porcie 8443, i nigdy nie pojawiają się w Twojej domenie publicznej na porcie 443. Zaktualizuj zakładki.
- Nowy interfejs JMAP, kalendarze i kontakty pokazuje, gdzie łączą się aplikacje poczty, kalendarza i kontaktów.`,
    fr_FR: `La console d'administration et le gestionnaire de comptes acceptent désormais la connexion à chaque adresse HTTPS activée sur leurs interfaces, y compris les adresses \`.local\`, IP du réseau local et \`.onion\` HTTPS du serveur. Activez ou désactivez des adresses dans l'onglet Interfaces pour choisir où la connexion fonctionne. Activer ou désactiver une adresse de connexion redémarre Stalwart, ce qui interrompt le courrier pendant quelques secondes.

- Votre nom d'utilisateur administrateur (\`admin\`) et votre mot de passe ne changent pas. Ils connectent désormais au compte administrateur du domaine de messagerie par défaut de Stalwart.
- Définir le mot de passe administrateur désactive aussi l'authentification à deux facteurs de ce compte, afin que le nouveau mot de passe suffise pour se connecter.
- StartOS ne conserve qu’une empreinte de votre mot de passe administrateur. Conservez le mot de passe que vous montre Définir le mot de passe administrateur.
- Afficher les enregistrements DNS demande votre mot de passe administrateur.
- La console d'administration et le gestionnaire de comptes ont désormais leurs propres adresses, sur le port 8443, et n'apparaissent jamais sur votre domaine public au port 443. Mettez à jour vos favoris.
- La nouvelle interface JMAP, calendriers et contacts indique où se connectent les applications de messagerie, de calendrier et de contacts.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const store = await storeJson.read().once()
      if (!store) return
      const { adminPassword, recoveryPassword, adminPasswordSynced, ...rest } =
        store
      await storeJson.write(
        effects,
        typeof adminPassword === 'string'
          ? {
              ...rest,
              adminPasswordSet: true,
              adminPasswordHash: hashPassword(adminPassword),
            }
          : rest,
      )
    },
    down: IMPOSSIBLE,
  },
})
