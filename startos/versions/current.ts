import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.1.0:1',
  releaseNotes: {
    en_US: `Open UI now opens the web console and the account manager at your mail server hostname, the only address where Stalwart accepts sign-in. On a new installation, setup offers the public domains on the Admin Console interface as the hostname, so add your hostname there first. Requires StartOS 0.4.2 or later.

- If your hostname is not a public domain on the Admin Console interface, a task asks you to add it. Sign-in and certificate renewal need it.
- On existing installations, sign in to the Admin Console with the recovery administrator (admin) and add the missing sysPasskey* permissions to the default roles before using passkeys; see [default roles on upgraded servers](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).`,
    es_ES: `Abrir UI ahora abre la consola web y el gestor de cuenta en el nombre de host de tu servidor de correo, la única dirección donde Stalwart permite iniciar sesión. En una instalación nueva, la configuración ofrece como nombre de host los dominios públicos de la interfaz Consola de administración, así que añade allí tu nombre de host primero. Requiere StartOS 0.4.2 o posterior.

- Si tu nombre de host no es un dominio público de la interfaz Consola de administración, una tarea te pide añadirlo. El inicio de sesión y la renovación del certificado lo necesitan.
- En instalaciones existentes, inicia sesión en la consola de administración con el administrador de recuperación (admin) y añade los permisos sysPasskey* que faltan a los roles predeterminados antes de usar claves de acceso; consulta [los roles predeterminados en servidores actualizados](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).`,
    de_DE: `UI öffnen öffnet die Webkonsole und die Kontoverwaltung jetzt unter dem Hostnamen deines Mailservers, der einzigen Adresse, an der Stalwart die Anmeldung erlaubt. Bei einer neuen Installation bietet die Einrichtung die öffentlichen Domains der Schnittstelle Administrationskonsole als Hostnamen an; füge deinen Hostnamen also zuerst dort hinzu. Erfordert StartOS 0.4.2 oder neuer.

- Ist dein Hostname keine öffentliche Domain der Schnittstelle Administrationskonsole, fordert dich eine Aufgabe auf, ihn hinzuzufügen. Anmeldung und Zertifikatserneuerung benötigen ihn.
- Bei bestehenden Installationen mit dem Wiederherstellungsadministrator (admin) an der Admin-Konsole anmelden und vor der Passkey-Nutzung die fehlenden sysPasskey*-Berechtigungen zu den Standardrollen hinzufügen; siehe [Standardrollen auf aktualisierten Servern](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).`,
    pl_PL: `Otwórz UI otwiera teraz konsolę webową i menedżera konta pod nazwą hosta serwera poczty, jedynym adresem, pod którym Stalwart pozwala się zalogować. W nowej instalacji konfiguracja proponuje jako nazwę hosta domeny publiczne interfejsu Konsola administracyjna, więc najpierw dodaj tam swoją nazwę hosta. Wymaga StartOS 0.4.2 lub nowszego.

- Jeśli Twoja nazwa hosta nie jest domeną publiczną interfejsu Konsola administracyjna, zadanie poprosi o jej dodanie. Jest potrzebna do logowania i odnawiania certyfikatu.
- W istniejących instalacjach zaloguj się do konsoli administracyjnej jako administrator odzyskiwania (admin) i dodaj brakujące uprawnienia sysPasskey* do ról domyślnych przed użyciem kluczy dostępu; zobacz [role domyślne na zaktualizowanych serwerach](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).`,
    fr_FR: `Ouvrir UI ouvre désormais la console web et le gestionnaire de compte sur le nom d'hôte de votre serveur de messagerie, la seule adresse où Stalwart accepte la connexion. Sur une nouvelle installation, la configuration propose comme nom d'hôte les domaines publics de l'interface Console d'administration ; ajoutez-y donc d'abord votre nom d'hôte. Nécessite StartOS 0.4.2 ou ultérieur.

- Si votre nom d'hôte n'est pas un domaine public de l'interface Console d'administration, une tâche vous demande de l'ajouter. La connexion et le renouvellement du certificat en ont besoin.
- Sur les installations existantes, connectez-vous à la console d’administration avec l’administrateur de récupération (admin) et ajoutez les permissions sysPasskey* manquantes aux rôles par défaut avant d’utiliser les clés d’accès ; consultez [les rôles par défaut sur les serveurs mis à jour](https://stalw.art/docs/auth/authorization/permissions#default-roles-on-upgraded-servers).`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
