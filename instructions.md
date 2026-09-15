# Stalwart

Running a mail server that the rest of the internet will talk to needs three things you provide: a domain you control, a public IP address that accepts and can send on port 25 (a [StartTunnel](https://docs.start9.com/start-tunnel/) gateway on a VPS is the reliable way to get one), and a few DNS records. The steps below walk through all of it.

## Documentation

- [Domains and DNS](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/domains) — managing hosted domains, the DNS records each one needs, TLS certificates and DKIM key rotation.
- [Setting up DNS](https://github.com/stalwartlabs/website/blob/main/src/content/docs/docs/install/dns.md) — what every DNS record a mail server publishes is for.
- [Securing your server](https://github.com/stalwartlabs/website/blob/main/src/content/docs/docs/install/security.md) — which ports to expose, administrator roles, access control.
- [Management](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/management) — the web console, the account manager, tasks, troubleshooting and the command-line client.
- [Accounts and groups](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/auth/principals) — creating user accounts, aliases, groups and quotas.
- [Email settings](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/email) — mailing lists, IMAP and JMAP settings, rate limits and mailbox maintenance.
- [FAQ](https://github.com/stalwartlabs/website/blob/main/src/content/docs/docs/faq.md) — frequently asked questions.

## What you get on StartOS

- **Admin Console** — the Stalwart web console, where you manage domains, accounts and every server setting. The same address serves JMAP, CalDAV, CardDAV, WebDAV and mail client autoconfiguration.
- **Account Manager** — a self-service page where each user changes their password and manages app passwords and two-factor authentication.
- **SMTP** (port 25), **SMTP Submission** (port 465), **IMAP** (port 993) and **ManageSieve** (port 4190) — the mail protocols, served by Stalwart with its own TLS certificate.
- **Actions** to set the admin password and to list the DNS records for your domains.

Everything Stalwart stores — mail, calendars, contacts, files, settings — lives in one embedded database and is included in StartOS backups.

## Getting set up

1. Run **Set Up Mail Server** and enter your email domain (`example.com`) and the hostname of this server (`mail.example.com`). The hostname must be the domain itself or a name under it.

2. Run **Set Admin Password**. Copy the username and password it shows — the password is not shown again, but you can run the action again for a new one.

3. Start Stalwart. The first start takes a minute while it creates the domain, its DKIM keys and the database.

4. Open the **Admin Console** interface and sign in with the username and password from step 2.

5. Publish the mail ports on your public address. On the **Interfaces** tab, enable the public IPv4 address on the **SMTP**, **SMTP Submission** and **IMAP** interfaces (and **ManageSieve** if you use server-side filters). StartOS publishes each one on the port shown in its address — `2525`, `10465`, `10993` and `14190`. Mail expects the standard ports, so add a port forward on your gateway from each standard port to the published one:

   | Standard port | Forward to |
   | ------------- | ---------- |
   | 25            | 2525       |
   | 465           | 10465      |
   | 993           | 10993      |
   | 4190          | 14190      |

   On StartTunnel these are **Published Ports** with the external port on the left and the internal port on the right. On a home router they are ordinary port-forwarding rules to your server's LAN IP. StartTunnel drops these rules whenever StartOS withdraws the automatic ones — after an update, a reinstall or a restore — so check they are still there if mail stops arriving.

6. Send outgoing mail from the same public address. Under **System › Gateways › Outbound Traffic**, choose the gateway you published the ports on, so other mail servers see your mail arriving from the IP address that your DNS records name.

7. Add your hostname as a public domain. On the **Admin Console** interface, add `mail.example.com` as a public domain with Let's Encrypt. This makes the console reachable at `https://mail.example.com/admin`, and it is also how Stalwart obtains the Let's Encrypt certificate it presents on the mail ports: the certificate is requested through this address, so keep it enabled. Add `autoconfig.example.com` and `mta-sts.example.com` the same way if you want mail clients to configure themselves and other servers to enforce TLS when delivering to you.

8. Publish your DNS records. Run **Show DNS Records** and create everything it lists at your DNS provider. It fills in the address records for `mail.example.com` from every gateway whose public address you enabled on the SMTP interface in step 5. If your gateway is a StartTunnel VPS, also set the reverse DNS (PTR) record for its IP to `mail.example.com` in your VPS provider's control panel — many receiving servers reject mail from an address without one.

9. Create your first user in the Admin Console under **Management › Directory › Accounts**. The account's email address is its login for IMAP and SMTP.

10. Set up a mail client with these settings, or let it configure itself if you published `autoconfig.example.com`:

    | Setting         | Value                             |
    | --------------- | --------------------------------- |
    | Incoming (IMAP) | `mail.example.com`, port 993, SSL |
    | Outgoing (SMTP) | `mail.example.com`, port 465, SSL |
    | Username        | the full email address            |

Until the Let's Encrypt certificate has been issued, Stalwart presents a self-signed certificate on the mail ports and your client will warn about it. Issuance needs the DNS `A` record and the public domain from step 7 to be in place; if it has not happened a few minutes after both are, restart Stalwart.

## Using Stalwart

### Admin Console

Sign in with the admin credentials. Domains are managed under **Management › Domains**, users and groups under **Management › Directory**, and every server setting under **Settings**. Additional email domains can be added there at any time — run **Show DNS Records** again afterwards for their records.

### Account Manager

Give this address to your users. They sign in with their own email address and password to change the password, create app passwords for mail clients, and enable two-factor authentication.

### Actions

- **Set Admin Password** — generates a new password for the `admin` account and shows it once. Run it whenever you have lost the password. It takes effect the next time Stalwart starts.
- **Show DNS Records** — lists the records to publish for each domain Stalwart hosts. Run it after adding a domain, and again if you rotate DKIM keys.

## Limitations

- Many ISPs and some VPS providers block outgoing connections on port 25, which stops Stalwart from delivering mail to other servers. If your provider does, ask them to unblock it or configure a relay host in the Admin Console.
- The email domain and hostname you chose during setup can only be changed in the Admin Console afterwards, not from StartOS.
- POP3 is not exposed. Use IMAP.
- After restoring Stalwart from a backup, add the public domain and enable the public addresses on the mail interfaces again; they are not part of the backup.
