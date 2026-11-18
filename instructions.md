# Stalwart

Running a mail server that the rest of the internet will talk to needs four things you provide: a domain you control, a public IP address that accepts connections on port 25 (a [StartTunnel](https://docs.start9.com/start-tunnel/) gateway on a VPS is the reliable way to get one), a few DNS records, and an account with an SMTP relay provider for outgoing mail. The steps below walk through all of it.

Receiving and storing mail works with the domain, the public address and the DNS records alone. Sending is different: Gmail, Microsoft and other large providers routinely reject or spam-folder mail that arrives directly from a home IP address, and from a VPS address with no sending reputation, even when every DNS record is correct. Send through a relay provider — a third-party SMTP service that delivers your mail from its own well-reputed servers — to reach inboxes reliably.

## Documentation

- [Domains and DNS](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/domains) — managing hosted domains, the DNS records each one needs, TLS certificates and DKIM key rotation.
- [Setting up DNS](https://github.com/stalwartlabs/website/blob/main/src/content/docs/docs/install/dns.md) — what every DNS record a mail server publishes is for.
- [Securing your server](https://github.com/stalwartlabs/website/blob/main/src/content/docs/docs/install/security.md) — which ports to expose, administrator roles, access control.
- [Management](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/management) — the web console, the account manager, tasks, troubleshooting and the command-line client.
- [Accounts and groups](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/auth/accounts) — creating user accounts, aliases, groups and quotas.
- [Email settings](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/email) — mailing lists, IMAP and JMAP settings, rate limits and mailbox maintenance.
- [Outbound delivery](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/mta/outbound) — relay routing, TLS policy and delivery troubleshooting.
- [FAQ](https://github.com/stalwartlabs/website/tree/main/src/content/docs/docs/faq) — frequently asked questions.

## What you get on StartOS

- **Admin Console** — the Stalwart web console, where you manage domains, accounts and every server setting. The same address serves JMAP, CalDAV, CardDAV, WebDAV and mail client autoconfiguration.
- **Account Manager** — a self-service page where each user changes their password and manages app passwords, passkeys and two-factor authentication.
- **SMTP** (port 25), **SMTP Submission** (port 465), **IMAP** (port 993) and **ManageSieve** (port 4190) — the mail protocols, served by Stalwart with its own TLS certificate.
- **Actions** to set the admin password and to list the DNS records for your domains.

Everything Stalwart stores — mail, calendars, contacts, files, settings — lives in one embedded database and is included in StartOS backups.

## Getting set up

1. Add your mail server hostname as a public domain. Under **Services > Stalwart > Interfaces > Admin Console**, click **Add Domain**, choose **Public Domain**, and add `mail.example.com` with Let's Encrypt. The web console accepts sign-in only at this address, and Stalwart obtains the Let's Encrypt certificate for the mail ports through it, so keep it enabled. Add `autoconfig.example.com` and `mta-sts.example.com` the same way if you want mail clients to configure themselves and other servers to enforce TLS when delivering to you.

2. Run **Set Up Mail Server**. Choose `mail.example.com` as the hostname — the list offers the public domains you added in step 1 — and enter your email domain (`example.com`). The hostname must be the email domain itself or a name under it.

3. Run **Set Admin Password**. Copy the username and password it shows — the password is not shown again, but you can run the action again for a new one.

4. Start Stalwart. The first start takes a minute while it creates the domain, its DKIM keys and the database.

5. Publish the mail ports on your public address. On the **Interfaces** tab, enable the public IPv4 address on the **SMTP**, **SMTP Submission** and **IMAP** interfaces (and **ManageSieve** if you use server-side filters). StartOS publishes each one on the port shown in its address — `2525`, `10465`, `10993` and `14190`. Mail expects the standard ports, so add a port forward on your gateway from each standard port to the published one:

   | Standard port | Forward to |
   | ------------- | ---------- |
   | 25            | 2525       |
   | 465           | 10465      |
   | 993           | 10993      |
   | 4190          | 14190      |

   On StartTunnel these are **Published Ports** with the external port on the left and the internal port on the right. On a home router they are ordinary port-forwarding rules to your server's LAN IP. StartTunnel 1.3.1 and later keep these rules when StartOS withdraws and re-requests its automatic mappings (after an update, a reinstall or a restore); on an older StartTunnel, update it first.

   Port 80 of the same public address must reach your server too: Stalwart's Let's Encrypt certificate for the mail ports is verified over it. On StartTunnel, keep the HTTP redirect for that IP turned on under **Settings › HTTP Redirect** — it is on by default. On a home router, forward port 80 to your server as well.

6. Publish your DNS records. Run **Show DNS Records** and create everything it lists at your DNS provider, including the address records even if a wildcard record already resolves `mail.example.com`: once any record exists for that name, the wildcard stops answering for it. It fills in the address records for `mail.example.com` from every gateway whose public address you enabled on the SMTP interface in step 5.

7. Open the **Admin Console** with **Open UI**, which takes you to `https://mail.example.com/admin/`, and sign in with the username and password from step 3. Signing in from the server's `.local`, IP or `.onion` address fails with "Client metadata documents are disabled".

8. Send outgoing mail through your relay provider, as described under **Sending through a relay provider** below.

9. Create your first user in the Admin Console under **Management › Directory › Accounts**. The account's email address is its login for IMAP and SMTP.

10. Set up a mail client with these settings, or let it configure itself if you published `autoconfig.example.com`:

    | Setting         | Value                             |
    | --------------- | --------------------------------- |
    | Incoming (IMAP) | `mail.example.com`, port 993, SSL |
    | Outgoing (SMTP) | `mail.example.com`, port 465, SSL |
    | Username        | the full email address            |

Until the Let's Encrypt certificate has been issued, Stalwart presents a self-signed certificate on the mail ports and your client will warn about it. Issuance needs the DNS `A` record, the public domain from step 1 and port 80 from step 5 to be in place; after repeated failed attempts, Let's Encrypt may rate-limit new requests for the hostname. That wait can be about 12 minutes, and restarting cannot shorten it. If there is still no certificate 15 minutes after all three are in place, restart Stalwart.

## Using Stalwart

### Sending through a relay provider

Choose an SMTP relay provider that lets you send from your own domain and gives you SMTP credentials. Then:

1. At the provider, add your email domain (`example.com`) and publish every DNS record it asks for to verify it. This usually includes the provider's own DKIM records, and a change to your SPF record.
2. Edit the SPF record that **Show DNS Records** listed for your domain (the `TXT` record starting `v=spf1`) to include the provider, using the `include:` value the provider gives you. Keep a single SPF record per name: a second one makes both invalid. Keep Stalwart's own DKIM records too — Stalwart still signs your mail before handing it to the relay.
3. In the Admin Console, open **Settings › MTA › Outbound › Routes** and create a route of type **Relay** named `smarthost`, with the provider's SMTP host, its port (usually 587; turn on **Implicit TLS** only for 465), and the username and password the provider gave you. Leave `allowInvalidCerts` off and save.
4. Under **Settings › MTA › Outbound › TLS Strategies**, create a strategy named `smarthost-tls`. Set `startTls` to `require`, leave `allowInvalidCerts` off, and save. Leave DANE and MTA-STS optional or disabled, not required: they authenticate a recipient's MX hosts, not your relay.
5. Open **Settings › MTA › Outbound › Strategy**. In **Route**, keep the rule that returns `'local'` for `is_local_domain(rcpt_domain)`, and change the final (else) value from `'mx'` to `'smarthost'`, quotes included. In **TLS**, remove the rule that returns `'invalid-tls'` after a TLS error and set the final (else) value to `'smarthost-tls'`. Save. Authenticated relay connections must require TLS and valid certificates on every attempt, including retries; Stalwart's default TLS fallback accepts invalid certificates.

If you use StartTunnel to keep your home IP private, send Stalwart's outbound traffic through that tunnel too. Otherwise the relay sees your home IP and may include it in message headers. If you use the tunnel only to receive mail on port 25, nothing needs changing.

Send a test message to an address at a large provider such as Gmail and check that it lands in the inbox. Mail for your own domains is still delivered locally.

### Sending directly

Without a relay, Stalwart delivers each message straight to the recipient's mail server. From a home IP address this will generally not reach inboxes: residential addresses are on the blocklists large providers use. From a VPS address it depends on that address's reputation, which you cannot control, so it is not recommended. If you send directly anyway:

- Under **System › Gateways › Outbound Traffic**, choose the gateway you published the ports on, so other mail servers see your mail arriving from the IP address that your DNS records name.
- If that gateway is a StartTunnel VPS, set the reverse DNS (PTR) record for its IP to `mail.example.com` in your VPS provider's control panel — many receiving servers reject mail from an address without one.
- The gateway must allow outgoing connections on port 25, which most home ISPs and some VPS providers block.

### Admin Console

Sign in with the admin credentials. Domains are managed under **Management › Domains**, users and groups under **Management › Directory**, and every server setting under **Settings**. Additional email domains can be added there at any time — run **Show DNS Records** again afterwards for their records.

### Account Manager

Give `https://mail.example.com/account/` (using your setup hostname) to your users. They sign in with their own email address and password to change the password, create app passwords for mail clients, and enable two-factor authentication.

Users in the internal directory can manage passkeys under **Account > Credentials** and use them for passwordless sign-in. Keep using HTTPS on your setup hostname. Passkeys are not a second factor: signing in with one does not ask for a TOTP code.

### Actions

- **Set Admin Password** — generates a new password for the `admin` account and shows it once. Run it whenever you have lost the password. It takes effect the next time Stalwart starts, and the old password stops working then.
- **Show DNS Records** — lists the records to publish for each domain Stalwart hosts, and offers each domain's records as a zone file to download. Run it after adding a domain, and again if you rotate DKIM keys.

## Limitations

- The email domain and hostname you chose during setup can only be changed in the Admin Console afterwards, not from StartOS.
- POP3 is not exposed. Use IMAP.
- After restoring Stalwart from a backup, add the public domain and enable the public addresses on the mail interfaces again; they are not part of the backup.
