# Stalwart

Running a mail server that the rest of the internet will talk to needs four things you provide: a domain you control, a public IP address that accepts connections on port 25 (a [StartTunnel](https://docs.start9.com/start-tunnel/) gateway on a VPS is the reliable way to get one), a few DNS records, and a way to send outgoing mail. To send, you need either an account with an SMTP relay provider, which the next paragraph recommends, or a gateway that lets your server open connections to port 25 on other mail servers, which most home ISPs and some VPS providers block. The steps below walk through all of it.

Receiving and storing mail works with the domain, the public address and the DNS records alone. Sending directly is harder. Home IP addresses are usually on policy blocklists such as the Spamhaus PBL, which mark addresses not designated for direct mail delivery, and many home ISPs also block outgoing connections to port 25. A VPS address can work, but large providers may throttle mail from an address with no sending history until it builds one, and Microsoft's Outlook.com sometimes blocks whole VPS address ranges because of mail other customers sent from them; clearing such a block means asking each provider to delist the affected IP range. A relay provider — a third-party SMTP service that delivers your mail from its own established servers — avoids these problems.

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

- **Admin Console** — the Stalwart web console, where you manage domains, accounts and every server setting.
- **Account Manager** — a self-service page where each user changes their password and manages app passwords, passkeys and two-factor authentication. The Admin Console and Account Manager share one list of addresses, separate from JMAP, CalDAV and CardDAV, so they stay private when you publish your hostname.
- **JMAP, Calendars & Contacts** — JMAP for modern mail clients, and CalDAV, CardDAV and WebDAV for calendars, contacts and files. The same addresses serve mail client autoconfiguration and MTA-STS.
- **SMTP** (port 25), **SMTP Submission** (port 465), **IMAP** (port 993) and **ManageSieve** (port 4190) — the mail protocols, served by Stalwart with its own TLS certificate.
- **Actions** to set the admin password and to list the DNS records for your domains.

Everything Stalwart stores — mail, calendars, contacts, files, settings — lives in one embedded database and is included in StartOS backups.

## Getting set up

1. Choose how Stalwart reaches the internet. If you use a StartTunnel gateway, or plan to, open **Services › Stalwart › Outbound Traffic** and choose that gateway before you continue; otherwise choose the gateway you will publish the mail ports on. Stalwart's Let's Encrypt certificate requests and outgoing mail then leave from that gateway's IP address, not your default internet connection's, whether you send through a relay provider or directly. StartOS blocks Stalwart's outgoing traffic while that gateway is down, rather than sending it another way.

2. Run **Set Up Mail Server** and enter your email domain (`example.com`) and the hostname of this server (`mail.example.com`). The hostname must be the domain itself or a name under it.

3. Run **Set Admin Password**. Copy the username (`admin`) and password it shows — the password is not shown again, but you can run the action again for a new one.

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

7. Add your hostname as a public domain. On the **JMAP, Calendars & Contacts** interface, add `mail.example.com` as a public domain with Let's Encrypt. StartOS also enables the domain on the mail interfaces whose public IPv4 address you enabled in step 5. The domain stays off on the **Admin Console** and **Account Manager**. Stalwart obtains the Let's Encrypt certificate it presents on the mail ports through `https://mail.example.com`, so keep that address enabled. Add `autoconfig.example.com` and `mta-sts.example.com` the same way if you want mail clients to configure themselves and other servers to enforce TLS when delivering to you.

8. Open the **Admin Console** with **Open UI** from your local network, at an address such as `https://your-server.local:8443/admin/`, and sign in with the username and password from step 3. The first time you sign in, Stalwart asks you to allow the web console access to your account; it remembers your answer.

9. Send outgoing mail through your relay provider, as described under **Sending through a relay provider** below.

10. Create your first user in the Admin Console under **Management › Directory › Accounts**. The account's email address is its login for IMAP and SMTP.

11. Set up a mail client with these settings, or let it configure itself if you published `autoconfig.example.com`:

    | Setting         | Value                             |
    | --------------- | --------------------------------- |
    | Incoming (IMAP) | `mail.example.com`, port 993, SSL |
    | Outgoing (SMTP) | `mail.example.com`, port 465, SSL |
    | Username        | the full email address            |

    Calendar and contacts apps find their server from `https://mail.example.com` with the same username and password.

Until the Let's Encrypt certificate has been issued, Stalwart presents a self-signed certificate on the mail ports and your client will warn about it. Issuance needs the DNS `A` record, the public domain from step 7 and port 80 from step 5 to be in place; after repeated failed attempts, Let's Encrypt may rate-limit new requests for the hostname. That wait can be about 12 minutes, and restarting cannot shorten it. If there is still no certificate 15 minutes after all three are in place, restart Stalwart.

## Using Stalwart

### Sending through a relay provider

Choose an SMTP relay provider that lets you send from your own domain and gives you SMTP credentials. Then:

1. At the provider, add your email domain (`example.com`) and publish every DNS record it asks for to verify it. This usually includes the provider's own DKIM records, and a change to your SPF record.
2. Edit the SPF record that **Show DNS Records** listed for your domain (the `TXT` record starting `v=spf1`) to include the provider, using the `include:` value the provider gives you. Keep a single SPF record per name: a second one makes both invalid. Keep Stalwart's own DKIM records too — Stalwart still signs your mail before handing it to the relay.
3. In the Admin Console, open **Settings › MTA › Outbound › Routes** and create a route of type **Relay** named `smarthost`, with the provider's SMTP host, its port (usually 587; turn on **Implicit TLS** only for 465), and the username and password the provider gave you. Leave `allowInvalidCerts` off and save.
4. Under **Settings › MTA › Outbound › TLS Strategies**, create a strategy named `smarthost-tls`. Set `startTls` to `require`, leave `allowInvalidCerts` off, and save. Leave DANE and MTA-STS optional or disabled, not required: they authenticate a recipient's MX hosts, not your relay.
5. Open **Settings › MTA › Outbound › Strategy**. In **Route**, keep the rule that returns `'local'` for `is_local_domain(rcpt_domain)`, and change the final (else) value from `'mx'` to `'smarthost'`, quotes included. In **TLS**, remove the rule that returns `'invalid-tls'` after a TLS error and set the final (else) value to `'smarthost-tls'`. Save. Authenticated relay connections must require TLS and valid certificates on every attempt, including retries; Stalwart's default TLS fallback accepts invalid certificates.

If you use StartTunnel to keep your home IP private, choose the tunnel as Stalwart's outbound gateway, as in step 1. Otherwise the relay sees your home IP and may include it in message headers. If you use the tunnel only to receive mail on port 25, nothing needs changing.

Send a test message to an address at a large provider such as Gmail and check that it lands in the inbox. Mail for your own domains is still delivered locally.

### Sending directly

Without a relay, Stalwart delivers each message straight to the recipient's mail server. From a home IP address this will generally not reach inboxes: residential addresses are often on policy blocklists that large providers check. You can exclude a single address from the Spamhaus PBL yourself if the address is static, runs your outbound mail server, has matching forward (A) and reverse (PTR) DNS records, and is assigned to you, unless your ISP's PBL policy forbids end-user exclusions; in that case, ask your ISP. An exclusion lasts at most one year, and the [Spamhaus PBL FAQ](https://www.spamhaus.org/faqs/policy-blocklist-pbl/) has the full rules. Many home connections do not qualify, because the address is dynamic or only the ISP can set its reverse DNS record. From a VPS address it depends on that address's reputation, which includes its IP range's history and any blocklist entries. You can check that reputation and ask to have entries cleared, but you cannot fully control it. If you send directly anyway:

- Stalwart's outbound gateway from step 1 must be the gateway you published the ports on, so other mail servers see your mail arriving from the IP address that your DNS records name.
- If that gateway is a StartTunnel VPS, set the reverse DNS (PTR) record for its IP to `mail.example.com` in your VPS provider's control panel — many receiving servers reject mail from an address without one.
- The gateway must allow outgoing connections on port 25, which most home ISPs and some VPS providers block.

These resources help you watch your address's reputation and clear blocklist entries:

- [Microsoft SNDS](https://sendersupport.olc.protection.outlook.com/snds/) — sign in with a Microsoft account and request access to your IP address to see Outlook.com's data on the mail it receives from that address.
- [Outlook.com postmaster](https://sendersupport.olc.protection.outlook.com/pm/) — Microsoft's sender guidelines for mail to Outlook.com, Hotmail and Live addresses. Its **Troubleshooting** page links Microsoft's sender support form, which needs a Microsoft account sign-in, for asking Microsoft to unblock an IP address. Mail that Microsoft 365 business mailboxes block is delisted through Microsoft's separate [delisting portal](https://sender.office.com/).
- [Google Postmaster Tools](https://postmaster.google.com/) — verify your domain to see its spam rate at Gmail and whether it meets Gmail's sender requirements. Google's [sender guidelines](https://support.google.com/a/answer/81126) list what Gmail requires.
- [Yahoo Sender Hub](https://senders.yahooinc.com/) — Yahoo's and AOL's sender requirements. Its [Contact](https://senders.yahooinc.com/contact/) page opens a ticket for problems delivering to Yahoo and AOL mailboxes.
- [Spamhaus IP and domain reputation checker](https://check.spamhaus.org/) — shows which Spamhaus list includes your IP address and why, and offers removal for the lists that allow it. A listing on the Spamhaus Blocklist (SBL) can only be removed at the request of your hosting provider.
- [Barracuda removal request](https://www.barracudacentral.org/rbl/removal-request) — request removal from the Barracuda reputation list.
- [MXToolbox blacklist check](https://mxtoolbox.com/blacklists.aspx) — check your IP address against many blocklists at once.

### Admin Console

Sign in with the admin credentials. Domains are managed under **Management › Domains**, users and groups under **Management › Directory**, and every server setting under **Settings**. Additional email domains can be added there at any time — run **Show DNS Records** again afterwards for their records.

### Where you can sign in

The Admin Console and Account Manager accept sign-in at every HTTPS address enabled on their interfaces, such as `https://your-server.local:8443/admin/`, the server's LAN IP and its HTTPS `.onion` address. The two interfaces share one list of addresses, on port 8443 unless another service already holds that port; the **Interfaces** tab shows the real number. `mail.example.com` on port 443 never serves either page. To choose where sign-in works, enable or disable addresses on either interface's page under **Interfaces**. Enabling or disabling an address restarts Stalwart, which interrupts mail for a few seconds. A disabled address still loads the sign-in page but refuses sign-in. Plain-HTTP addresses, such as the `.onion` address on port 8081, do not accept sign-in.

To reach the Admin Console and Account Manager from the internet, enable `mail.example.com` on the **Account Manager** interface's page. They are then served at `https://mail.example.com:8443/admin/` and `https://mail.example.com:8443/account/`.

### Account Manager

Give your users the Account Manager's address, such as `https://your-server.local:8443/account/` on your local network. They sign in with their own email address and password to change the password, create app passwords for mail clients, and enable two-factor authentication.

Users in the internal directory can manage passkeys under **Account > Credentials** and use them for passwordless sign-in. Passkeys work only on an address that uses your setup hostname, so they need `mail.example.com` enabled on the Account Manager, as described under **Where you can sign in**; they do not work at `your-server.local`. Passkeys are not a second factor: signing in with one does not ask for a TOTP code.

### Actions

- **Set Admin Password** — generates a new password for `admin` in Stalwart's default email domain and shows it once. StartOS keeps only a hash of it, so save it in your password manager. Run it whenever you have lost the password. It takes effect the next time Stalwart starts, and the old password stops working then. It also restores administrator privileges and removes the account's two-factor authentication, password expiry and IP restrictions.
- **Show DNS Records** — asks for the admin password, then lists the records to publish for each domain Stalwart hosts, and offers each domain's records as a zone file to download. If two-factor authentication is enabled for the admin account, enter an app password for that account instead of its main password. To create one, sign in to the Account Manager as `admin` and go to **Credentials › App Passwords › Create App Password**, then set **Permissions › Type** to **Same permissions as account**. An app password with **Replace all permissions** also works if its permissions include at least **"Sign in to the server"**, **"Query domains"** and **"Get domains"**. Run it after adding a domain, and again if you rotate DKIM keys.
- **Unblock IP Addresses** — Stalwart blocks an address that fails to sign in too many times, or that probes the server, and a blocked address cannot reach the Admin Console, the Account Manager or any mail port. If that happens to you, run this action with the admin password and the address to unblock, or leave the list empty to unblock every address. It works even while your own address is blocked.

## Limitations

- The email domain and hostname you chose during setup can only be changed in the Admin Console afterwards, not from StartOS.
- POP3 is not exposed. Use IMAP.
- After restoring Stalwart from a backup, choose its outbound gateway, add the public domain and enable the public addresses on the mail interfaces again; they are not part of the backup.
