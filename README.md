<p align="center">
  <img src="icon.svg" alt="Stalwart Logo" width="21%" />
</p>

# Stalwart on StartOS

> Everything not listed in this document should behave the same as upstream
> Stalwart. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Stalwart](https://github.com/stalwartlabs/stalwart) is an all-in-one mail and collaboration server: SMTP, IMAP, JMAP, ManageSieve, CalDAV, CardDAV and WebDAV in one binary, with an embedded database, a built-in spam filter and a web administration console. This package runs it as a single-domain mail server whose first-run configuration is driven from StartOS instead of Stalwart's setup wizard.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

The package runs upstream's unmodified Docker image on `x86_64` and `aarch64`, with the image's entrypoint (`stalwart --config /etc/stalwart/config.json`). The image has no init system.

Three subcontainers run from that image on every start:

| Subcontainer        | Runs as                           | Purpose                                                                                 |
| ------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| `maintenance-chown` | root                              | Oneshot: creates the WebUI unpack directory and chowns both mounts to uid/gid 2000      |
| `maintenance-sub`   | image user (`stalwart`, uid 2000) | A temporary Stalwart the package configures over JMAP, stopped before the server starts |
| `stalwart-sub`      | image user (`stalwart`, uid 2000) | The server itself                                                                       |

During first-run bootstrap (see [Installation and First-Run Flow](#installation-and-first-run-flow)) the same image runs briefly as `bootstrap-sub`, `bootstrap-chown`, `configure-sub` and `configure-chown`; none of them exist once the service is running normally.

Every JMAP call the package makes goes to one of those temporary runs (`withMaintenanceStalwart`). Each run generates a random password and starts Stalwart in recovery mode (`STALWART_RECOVERY_MODE=1`) with `STALWART_RECOVERY_ADMIN=stalwart-startos:<hash>`; Stalwart accepts a PHC hash in place of the password, and the package authenticates as `stalwart-startos`. Recovery mode opens none of the configured listeners and no mail queue, only one HTTP listener on `STALWART_RECOVERY_MODE_PORT`, which the package sets to 18080. No interface binds that port, so StartOS forwards nothing to it. The second bootstrap run is the exception: it has to be a normal start, so it opens the configured listeners. It disables all of the package's bindings with `clearBindings` for its duration and re-runs `setInterfaces` afterwards, which enables them again with the user's address choices intact. When a run stops, the package discards the password. The server itself starts without `STALWART_RECOVERY_ADMIN`, so no recovery admin exists while it serves, and the package holds no credential for it. The user signs in as `admin@<domain>`, a regular account with the Admin role, whose password `set-admin-password` sets.

## Volume and Data Layout

One volume, `main`, holds everything Stalwart persists plus the package's own state.

| Path in volume | Mounted at          | Contents                                                                                              |
| -------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `etc/`         | `/etc/stalwart`     | `config.json`, which names the datastore and nothing else                                             |
| `data/`        | `/var/lib/stalwart` | The RocksDB datastore — mail, calendars, contacts, files, spam model, and every server setting object |
| `data/webui/`  | (inside the above)  | The unpacked web console bundle, so restarts do not re-download it                                    |
| `store.json`   | not mounted         | StartOS-side state: hostname, email domain, whether an admin password is set, a pending password hash |

Everything Stalwart configures after bootstrap — listeners, domains, DKIM keys, ACME state, accounts, spam rules — is a record inside the RocksDB datastore, not a file. There is no configuration file to edit by hand.

## File Models

The package owns two files; Stalwart's own configuration lives in its database and has no model.

| File              | Format | Seeded by                                                           | Rewritten by                                         | Hand edits                       |
| ----------------- | ------ | ------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------- |
| `store.json`      | JSON   | `setup` (hostname, domain) and `set-admin-password` (password hash) | Those actions, and `main` (deletes the applied hash) | Survive, but are never validated |
| `etc/config.json` | JSON   | Stalwart itself, when bootstrap completes                           | Stalwart, if the datastore is moved                  | Survive                          |

`store.json` never holds a password. `set-admin-password` stores `adminPasswordSet: true` and `adminPasswordHash`, a `$pbkdf2-sha256$` PHC hash of the new password of `admin@<domain>`. On the next start, the maintenance run writes the hash to the account over JMAP, where Stalwart stores a recognised hash as-is, and deletes it from `store.json`, so the account's password is replaced once per run of the action. The presence of `etc/config.json` is what the package uses to decide whether bootstrap has already run — deleting it makes the next init re-run bootstrap against the existing datastore, which fails because the domain already exists.

## Dependencies

None.

## Network Access and Interfaces

All bindings share one host (`mail`). The two web listeners are proxied by StartOS; every mail port is a plain port forward straight to Stalwart, which serves its own TLS certificate on them, so that the server sees the real client address for SPF, DNSBL, rate limiting and auto-banning.

| Interface id  | Type  | Container port | Published port | Protocol                                 | Purpose                                                                                                   |
| ------------- | ----- | -------------- | -------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `jmap-dav`    | `api` | 8080           | 80 / 443       | HTTP, TLS terminated by StartOS          | JMAP at `/jmap/`, CalDAV/CardDAV/WebDAV at `/dav/`; also autoconfig, MTA-STS, `.well-known`, ACME HTTP-01 |
| `admin`       | `ui`  | 8081           | 8081 / 8443    | HTTP, TLS terminated by StartOS          | Web console at `/admin/`                                                                                  |
| `account`     | `ui`  | 8081           | 8081 / 8443    | same binding                             | Account manager at `/account/`                                                                            |
| `smtp`        | `api` | 25             | 2525           | SMTP with STARTTLS, forwarded raw        | Inbound MX                                                                                                |
| `submissions` | `api` | 465            | 10465          | SMTP over implicit TLS, forwarded raw    | Client submission                                                                                         |
| `imaps`       | `api` | 993            | 10993          | IMAP over implicit TLS, forwarded raw    | Client access                                                                                             |
| `sieve`       | `api` | 4190           | 14190          | ManageSieve with STARTTLS, forwarded raw | Sieve script management                                                                                   |

StartOS does not let a package claim a host port below 1025 and publishes a raw port on the same number it holds on the box, so the standard mail ports cannot be published by the package itself. The published numbers above are fixed so that a user can map `25 → 2525`, `465 → 10465`, `993 → 10993` and `4190 → 14190` once on their gateway; if one of them is already taken on the box StartOS assigns a random port instead and the Interfaces tab shows the real number.

Stalwart serves the same HTTP routes on both web listeners: `http` on 8080, which bootstrap provisions, and `console` on 8081, which the maintenance run creates when it is missing. The maintenance run also sets the `Http` singleton's `allowedEndpoints` to answer 403 for paths starting with `/admin` or `/account` on local port 8080, so the console's pages are served only on the `admin` and `account` interfaces' addresses, and a public domain enabled for JMAP and DAV does not expose them. Stalwart exempts loopback clients from `allowedEndpoints`. The console's management calls are ordinary JMAP requests, which both listeners accept from authenticated admins.

Stalwart's `defaultHostname` is the hostname chosen at setup, so its `.well-known` discovery documents, SRV records and autoconfig point at `https://<hostname>` and the standard ports. `STALWART_PUBLIC_URL` remains unset; no alternate proxy address is imposed on discovery.

Stalwart trusts its built-in web console as an OAuth client only on its own hostname; from any other origin the console falls through to client metadata documents, which are disabled ("Client metadata documents are disabled"). The package therefore registers the console as an OAuth client of its own, `startos-webui`, and points the WebUI `Application`'s `oauthClientId` at it. The client's redirect and post-logout URIs are the `oauth/callback` and `login` pages under `/admin/` and `/account/` at every enabled HTTPS address of the `admin` and `account` interfaces, leaving out loopback, link-local and bridge addresses. The two interfaces share one binding and so one address list. The `maintenance` oneshot in `main` rewrites the URIs on every start, and `main` re-runs it, restarting Stalwart, whenever that list changes, so enabling or disabling an address on the Interfaces tab allows or refuses sign-in there. Plain-HTTP addresses, such as the port-80 onion, are left out, because Stalwart accepts plain-HTTP redirect URIs only on loopback. A disabled address no longer accepts sign-in, but the console page still loads on every address the `console` listener answers on. Stalwart asks each account to consent to the client once and remembers the grant. Passkeys use the setup hostname as their relying party ID, so passkey sign-in works only at an address with that hostname, such as the public domain enabled on the `account` interface's port 8443.

Stalwart reads `X-Forwarded-For` from one trusted proxy hop on the HTTP listener (`clientIpSource`), which StartOS sets on the proxied binding, so web logins are rate-limited and auto-banned by client address rather than by the proxy's.

POP3 is not exposed: the `pop3s` listener Stalwart creates by default is deleted at bootstrap.

## Installation and First-Run Flow

Install raises two critical tasks and starts nothing until both are done: `setup` (email domain and hostname) and `set-admin-password`. Once both are done and `etc/config.json` does not exist, an init handler bootstraps Stalwart in two maintenance runs, each torn down when its step succeeds:

1. **Bootstrap mode.** Stalwart starts without a config file, which puts it in its bootstrap mode on port 18080 with the run's recovery admin pinned. The package posts `x:Bootstrap/set` with the hostname, the domain, RocksDB under `/var/lib/stalwart`, the internal directory, a console (stdout) tracer, manual DNS management, DKIM key generation on and ACME off. Stalwart writes `config.json`, creates the domain, its DKIM keys and a permanent `admin@<domain>` account whose generated password the package discards; the maintenance run of the first start replaces it.
2. **First normal start.** Stalwart starts normally — this is the run in which it provisions its default listeners, DKIM keys and the rest of its configuration. The package sets `Http.clientIpSource` to `xForwardedFor` with one trusted proxy hop, pins the WebUI's `unpackDirectory` to `/var/lib/stalwart/webui` and its `oauthClientId` to `startos-webui`, deletes the `pop3s` listener, creates a Let's Encrypt `AcmeProvider` using the `Http01` challenge with `postmaster@<domain>` as contact, and switches the domain's certificate management to that provider with the hostname's label as the only subject alternative name.

The whole sequence takes well under a minute and reports progress as "Configuring Stalwart". If it fails it retries until it succeeds or a five-minute timeout expires; the log names the JMAP method and error.

Stalwart's setup wizard is therefore never shown. On first start of the real daemon Stalwart downloads the web console bundle from GitHub releases and the ASN/GeoIP tables it uses for sender reputation; without outbound HTTPS the console paths return 404 until a download succeeds, and the mail server still runs.

The Let's Encrypt certificate for the mail ports is obtained by Stalwart, not StartOS: the ACME HTTP-01 challenge arrives on port 80 of the public address, is redirected to 443 by StartTunnel's per-IP HTTP redirect (on by default; `start-tunnel http-redirect list` shows it) or by StartOS behind a router that forwards port 80, and is proxied to Stalwart's HTTP listener like any other request for that domain. That only works once the hostname has been added as a public domain on the `jmap-dav` interface, which serves it on 443, and resolves in DNS; until then Stalwart serves a self-signed certificate. StartOS issues its own certificate for the same hostname over TLS-ALPN-01 on 443, so a valid certificate on the console says nothing about port 80. Stalwart retries transient issuance failures automatically, with exponential backoff. Repeated failed validations can exhaust Let's Encrypt's per-account, per-hostname failure allowance, which refills once every 12 minutes. Further orders then receive a rate limit and a `Retry-After` specifying the remaining wait. Stalwart waits at least that long and records the reason in the task's `failureReason` ("Rate limited. Retry after N seconds", visible with `x:Task/get`). The `acme.renew-backoff` and `task-manager.task-retry` events are DEBUG-level, so early retries can be absent from the INFO log; repeated failures can also produce a WARN-level `task-manager.task-stalled` event. Every start's maintenance run also calls `armAcme`, which, when no unexpired certificate covers the hostname and the domain is still on automatic management, creates an `AcmeRenewal` singleton due immediately. Upstream replaces the previous singleton; explicit destruction of an automatic domain's renewal task is forbidden. A restart therefore requests an immediate retry and resets Stalwart's backoff, but inside a Let's Encrypt `Retry-After` window that retry is refused the same way and issuance still waits for the window to close. Once a certificate exists, Stalwart's own renewal schedule takes over and `armAcme` does nothing.

## Actions

Three actions, driven from `store.json` or, for `show-dns-records`, the running server's JMAP API as `admin@<domain>`.

- **`setup`** (hidden — not user-facing) — Satisfies the install task. Validates that the hostname equals the domain or ends in `.<domain>`, lower-cases both and writes them to `store.json`. Runs only while stopped and only before bootstrap has happened; afterwards it is unreachable, and the values it wrote are only read again by the bootstrap. Changing the hostname or domain later is done in Stalwart's console (`SystemSettings.defaultHostname`, the `Domain` record).
- **`set-admin-password`** — Run when the admin password is lost or needs rotating. Generates a 32-character password, writes its hash to `store.json`, and returns `admin@<domain>` and the password once. It is stopped-only: the maintenance run applies the hash on the next start, replacing the account's password credential, clearing its two-factor secret, and recreating the account with the Admin role if it was deleted. App passwords and passkeys are kept. Safe to repeat; every run invalidates the previous password, and once a password exists the action asks for confirmation before replacing it.
- **`show-dns-records`** — Run after setup, after adding a domain in the console, or after a DKIM rotation. Takes the admin password and signs in with it as `admin@<domain>`, failing with "Incorrect password" if Stalwart refuses it. It reads the SMTP binding's addresses and emits one `A`/`AAAA` block per gateway whose public address is enabled there (Stalwart's own zone file never contains the address record), then one zone file per `Domain` read over JMAP, each copyable and downloadable as `<domain>.zone`. With no public address enabled it says so and returns the zone files alone. Gateways are labelled by id (`wg0`, `eno0`); the friendly name is not available to packages. Read-only, instant, running-only; changes nothing.

## Tasks

Two critical tasks at install, one per setup value the bootstrap needs.

- **`setup`** — Raised by init whenever `store.json` lacks `hostname` or `domain`. Critical: the service cannot start. Cleared by running `setup`. Cannot return after bootstrap, because the action's writes are never undone.
- **`set-admin-password`** — Raised by init whenever `store.json` lacks `adminPasswordSet`. Critical. Cleared by running `set-admin-password`. Cannot return.

No task is raised on another service.

## Health Checks

One check, on the daemon; the `maintenance` oneshot before it is not a health check and reports nothing.

- **`stalwart`** ("Mail Server") — `GET http://127.0.0.1:8080/healthz/live` without forwarding headers. Loopback connections fall back to their socket address; Stalwart rejects a claimed loopback address in `X-Forwarded-For`. Ten-second grace period. Failing after the grace period means the process is not serving HTTP at all: the usual causes are a datastore it cannot open (ownership on `/var/lib/stalwart`, a RocksDB `LOCK` left by an unclean stop) or a listener it cannot bind, both of which the log states in its first lines. A green check says nothing about mail flow; the console's Telemetry and queue pages do.

## Backups and Restore

The `main` volume is backed up. StartOS stops the service first, so the RocksDB files are captured at rest and consistent; `store.json` travels with them, so a restored instance has its hostname, domain and admin password and needs no re-setup.

The unpacked WebUI bundle and the downloaded ASN tables are included and are re-downloaded anyway if missing. Mail volume is the whole backup: a busy server's datastore is the largest thing on the disk, and every backup copies it in full.

A restored instance starts with the same DKIM keys, ACME account and certificate, so no DNS change is needed. What does not come back is StartOS host state: the public domain on the `jmap-dav` interface, the enabled public addresses on the mail bindings and the outbound gateway are gone after a restore and have to be re-added. If the restore lands on a different public IP, the `A` records, and the PTR record when sending directly, are the only DNS to update. Restoring is only possible while the package is not installed; StartOS refuses to restore over an existing install.

## Limitations and Differences

What this package cannot do, or does differently from a Stalwart installed by hand — most of it follows from StartOS owning the ports below 1025 and the resolver.

1. The standard mail ports (25, 465, 993, 4190) are published on 2525, 10465, 10993 and 14190 and must be mapped on the gateway by the user; nothing in the package can claim them.
2. The mail ports carry Stalwart's own certificate. Until ACME succeeds it is self-signed, and ACME can only succeed once the hostname is a public domain on the `jmap-dav` interface with a working `A` record and port 80 of the public address reaches the server.
3. Outbound delivery defaults to direct MX delivery through StartOS's selected outbound gateway. The recommended relay setup, its DNS changes and its console walkthrough are under **Sending through a relay provider** in `instructions.md`; the package does not configure these settings. Authenticated relay hops need a TLS strategy that requires encryption and validates certificates on every attempt, including retries, rather than Stalwart's default opportunistic TLS and invalid-certificate fallback. The relay still sees the outbound gateway's IP and may include it in message headers, so a tunnel used for IP privacy must also carry outbound traffic. Receiving needs no relay. Direct sending needs the outbound gateway set to the one publishing the mail ports, a PTR record on its IP, and outbound port 25 open. Correct DNS and an open port do not overcome residential policy blocklists or poor or unknown VPS IP reputation.
4. POP3 is disabled.
5. Stalwart's setup wizard is bypassed. Storage backends (PostgreSQL, S3, …), external directories (LDAP, OIDC, SQL) and DNS-provider automation are not offered at setup; all remain available in the console afterwards.
6. Hostname and email domain are set once from StartOS; later changes are made in the console and are not reflected in `store.json`, which only the bootstrap and `show-dns-records`' hostname reminder read.
7. The web console is fetched from GitHub at first start rather than shipped in the image, so the console (not the mail server) depends on outbound HTTPS once.
8. Enterprise-licensed features (LLM spam classification, multi-tenancy, some telemetry views) are unavailable, as in the community edition upstream.
9. DANE is disabled for outbound delivery: the StartOS resolver forwards queries without DNSSEC validation, and Stalwart turns DANE off rather than defer mail (`registry.build-warning` at every start). The TLSA records in the zone file only help senders if the user's own zone is DNSSEC-signed.

---

## Quick Reference for AI Consumers

```yaml
package_id: stalwart
image: stalwartlabs/stalwart
architectures: [x86_64, aarch64]
subcontainers: [maintenance-chown, maintenance-sub, stalwart-sub]
volumes:
  main: /etc/stalwart (etc/), /var/lib/stalwart (data/)
file_models:
  - store.json
  - etc/config.json
startos_managed_env_vars: # maintenance runs only
  - STALWART_RECOVERY_ADMIN
  - STALWART_RECOVERY_MODE
  - STALWART_RECOVERY_MODE_PORT
dependencies: none
interfaces:
  jmap-dav: { type: api, port: 8080 }
  admin: { type: ui, port: 8081 }
  account: { type: ui, port: 8081 }
  smtp: { type: api, port: 25 }
  submissions: { type: api, port: 465 }
  imaps: { type: api, port: 993 }
  sieve: { type: api, port: 4190 }
actions:
  - setup
  - set-admin-password
  - show-dns-records
tasks:
  - { action: setup, severity: critical }
  - { action: set-admin-password, severity: critical }
health_checks:
  - stalwart
```
