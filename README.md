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

The package runs upstream's own Docker image unmodified, on `x86_64` and `aarch64`, with the image's entrypoint (`stalwart --config /etc/stalwart/config.json`). The image has no init system.

Two subcontainers run from that image on every start:

| Subcontainer     | Runs as                           | Purpose                                                                                              |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `stalwart-chown` | root                              | Oneshot: creates the WebUI unpack directory and chowns both mounts to uid/gid 2000 before the daemon |
| `stalwart-sub`   | image user (`stalwart`, uid 2000) | The server itself                                                                                    |

During first-run bootstrap (see [Installation and First-Run Flow](#installation-and-first-run-flow)) the same image runs briefly as `bootstrap-sub`, `bootstrap-chown`, `configure-sub` and `configure-chown`; none of them exist once the service is running normally.

The daemon receives one environment variable from the package: `STALWART_RECOVERY_ADMIN`, set to `admin:<password>` from `store.json`. Stalwart honours it in normal operation, so it is the package-owned administrator credential; it bypasses the account directory and is what the `set-admin-password` action rotates.

## Volume and Data Layout

One volume, `main`, holds everything Stalwart persists plus the package's own state.

| Path in volume | Mounted at          | Contents                                                                                              |
| -------------- | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `etc/`         | `/etc/stalwart`     | `config.json`, which names the datastore and nothing else                                             |
| `data/`        | `/var/lib/stalwart` | The RocksDB datastore — mail, calendars, contacts, files, spam model, and every server setting object |
| `data/webui/`  | (inside the above)  | The unpacked web console bundle, so restarts do not re-download it                                    |
| `store.json`   | not mounted         | StartOS-side state: hostname, email domain, admin password                                            |

Everything Stalwart configures after bootstrap — listeners, domains, DKIM keys, ACME state, accounts, spam rules — is a record inside the RocksDB datastore, not a file. There is no configuration file to edit by hand.

## File Models

The package owns two files; Stalwart's own configuration lives in its database and has no model.

| File              | Format | Seeded by                                                      | Rewritten by                        | Hand edits                       |
| ----------------- | ------ | -------------------------------------------------------------- | ----------------------------------- | -------------------------------- |
| `store.json`      | JSON   | `setup` (hostname, domain) and `set-admin-password` (password) | Those actions only                  | Survive, but are never validated |
| `etc/config.json` | JSON   | Stalwart itself, when bootstrap completes                      | Stalwart, if the datastore is moved | Survive                          |

`store.json`'s `adminPassword` is delivered by environment variable and Stalwart reads it on every launch, so rotation is a rewrite of the store followed by a restart; nothing on disk inside the datastore carries it. The presence of `etc/config.json` is what the package uses to decide whether bootstrap has already run — deleting it makes the next init re-run bootstrap against the existing datastore, which fails because the domain already exists.

## Dependencies

None.

## Network Access and Interfaces

All bindings share one host (`mail`). The web listener is proxied by StartOS; every mail port is a plain port forward straight to Stalwart, which serves its own TLS certificate on them, so that the server sees the real client address for SPF, DNSBL, rate limiting and auto-banning.

| Interface id  | Type  | Container port | Published port | Protocol                                 | Purpose                                                                |
| ------------- | ----- | -------------- | -------------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `admin`       | `ui`  | 8080           | 80 / 443       | HTTP, TLS terminated by StartOS          | Web console at `/admin/`; also JMAP, WebDAV, autoconfig, `.well-known` |
| `account`     | `ui`  | 8080           | 80 / 443       | same binding                             | Account manager at `/account/`                                         |
| `smtp`        | `api` | 25             | 2525           | SMTP with STARTTLS, forwarded raw        | Inbound MX                                                             |
| `submissions` | `api` | 465            | 10465          | SMTP over implicit TLS, forwarded raw    | Client submission                                                      |
| `imaps`       | `api` | 993            | 10993          | IMAP over implicit TLS, forwarded raw    | Client access                                                          |
| `sieve`       | `api` | 4190           | 14190          | ManageSieve with STARTTLS, forwarded raw | Sieve script management                                                |

StartOS does not let a package claim a host port below 1025 and publishes a raw port on the same number it holds on the box, so the standard mail ports cannot be published by the package itself. The published numbers above are fixed so that a user can map `25 → 2525`, `465 → 10465`, `993 → 10993` and `4190 → 14190` once on their gateway; if one of them is already taken on the box StartOS assigns a random port instead and the Interfaces tab shows the real number.

Stalwart's `defaultHostname` is the hostname chosen at setup, so its `.well-known` discovery documents, SRV records and autoconfig point at `https://<hostname>` and the standard ports. The web console itself is origin-relative — its login works at any StartOS address, LAN, Tor or public — because its discovery endpoint returns path-relative URLs on the plain-HTTP session the proxy opens. `STALWART_PUBLIC_URL` is deliberately unset.

Stalwart trusts `X-Forwarded-For` on the HTTP listener (`useXForwarded`), which StartOS sets on the proxied binding, so web logins are rate-limited and auto-banned by client address rather than by the proxy's.

POP3 is not exposed: the `pop3s` listener Stalwart creates by default is deleted at bootstrap.

## Installation and First-Run Flow

Install raises two critical tasks and starts nothing until both are done: `setup` (email domain and hostname) and `set-admin-password`. Once `store.json` holds all three values and `etc/config.json` does not exist, an init handler bootstraps Stalwart in two temporary runs of the image, each torn down when its step succeeds:

1. **Bootstrap mode.** Stalwart starts without a config file, which puts it in its bootstrap mode on port 8080 with the recovery admin pinned. The package posts `x:Bootstrap/set` with the hostname, the domain, RocksDB under `/var/lib/stalwart`, the internal directory, a console (stdout) tracer, manual DNS management, DKIM key generation on and ACME off. Stalwart writes `config.json`, creates the domain, its DKIM keys and a permanent `admin@<domain>` account whose generated password the package discards — the recovery admin is the credential the package owns.
2. **First normal start.** Stalwart starts normally — this is the run in which it provisions its default listeners, DKIM keys and the rest of its configuration. The package sets `Http.useXForwarded`, pins the WebUI's `unpackDirectory` to `/var/lib/stalwart/webui`, deletes the `pop3s` listener, creates a Let's Encrypt `AcmeProvider` using the `Http01` challenge with `postmaster@<domain>` as contact, and switches the domain's certificate management to that provider with the hostname's label as the only subject alternative name.

The whole sequence takes well under a minute and reports progress as "Configuring Stalwart". If it fails it retries until it succeeds or a five-minute timeout expires; the log names the JMAP method and error.

Stalwart's setup wizard is therefore never shown. On first start of the real daemon Stalwart downloads the web console bundle from GitHub releases and the ASN/GeoIP tables it uses for sender reputation; without outbound HTTPS the console paths return 404 until a download succeeds, and the mail server still runs.

The Let's Encrypt certificate for the mail ports is obtained by Stalwart, not StartOS: the ACME HTTP-01 challenge arrives on port 80 of the public address, is redirected to 443 by StartTunnel or StartOS, and is proxied to Stalwart's HTTP listener like any other request for that domain. That only works once the hostname has been added as a public domain on the `admin` interface and resolves in DNS; until then Stalwart serves a self-signed certificate. Stalwart does not reschedule issuance on its own: a renewal task claimed by an instance that was killed stays locked for an hour, and one that has exhausted its retries stays failed. So every start runs an `acme` oneshot after the daemon is healthy which, when no unexpired certificate covers the hostname and the domain is still on automatic management, destroys any existing renewal task and creates a new one due immediately. A restart is therefore the way to retry issuance once DNS and the public domain are in place. Once a certificate exists, Stalwart's own renewal schedule takes over and the oneshot does nothing.

## Actions

Three actions, all driven from `store.json` or the running server's JMAP API as the recovery admin.

- **`setup`** (hidden — not user-facing) — Satisfies the install task. Validates that the hostname equals the domain or ends in `.<domain>`, lower-cases both and writes them to `store.json`. Runs only while stopped and only before bootstrap has happened; afterwards it is unreachable, and the values it wrote are only read again by the bootstrap. Changing the hostname or domain later is done in Stalwart's console (`SystemSettings.defaultHostname`, the `Domain` record).
- **`set-admin-password`** — Run when the admin password is lost or needs rotating. Generates a 32-character password, writes it to `store.json`, returns `admin` and the password once. Costs a restart: the daemon reads the value from its environment at launch, so the action is stopped-only and the new password is live on the next start. Safe to repeat; every run invalidates the previous password. It does not touch the permanent `admin@<domain>` account Stalwart created at bootstrap.
- **`show-dns-records`** — Run after setup, after adding a domain in the console, or after a DKIM rotation. Takes no input: it reads the SMTP binding's addresses and emits one `A`/`AAAA` block per gateway whose public address is enabled there (Stalwart's own zone file never contains the address record), then one copyable zone file per `Domain` read over JMAP. With no public address enabled it says so and returns the zone files alone. Gateways are labelled by id (`wg0`, `eno0`); the friendly name is not available to packages. Read-only, instant, running-only; changes nothing.

## Tasks

Two critical tasks at install, one per setup value the bootstrap needs.

- **`setup`** — Raised by init whenever `store.json` lacks `hostname` or `domain`. Critical: the service cannot start. Cleared by running `setup`. Cannot return after bootstrap, because the action's writes are never undone.
- **`set-admin-password`** — Raised by init whenever `store.json` lacks `adminPassword`. Critical. Cleared by running `set-admin-password`. Cannot return.

No task is raised on another service.

## Health Checks

One check, on the daemon; the `acme` oneshot that follows it is not a health check and reports nothing.

- **`stalwart`** ("Mail Server") — `GET http://127.0.0.1:8080/healthz/live` with `X-Forwarded-For` set, the liveness probe upstream's image also uses. Ten-second grace period. Failing after the grace period means the process is not serving HTTP at all: the usual causes are a datastore it cannot open (ownership on `/var/lib/stalwart`, a RocksDB `LOCK` left by an unclean stop) or a listener it cannot bind, both of which the log states in its first lines. A green check says nothing about mail flow; the console's Telemetry and queue pages do.

## Backups and Restore

The `main` volume is copied wholesale (`Backups.ofVolumes`). StartOS stops the service first, so the RocksDB files are captured at rest and consistent; `store.json` travels with them, so a restored instance has its hostname, domain and admin password and needs no re-setup.

Nothing is excluded. The unpacked WebUI bundle and the downloaded ASN tables are included and are re-downloaded anyway if missing. Mail volume is the whole backup: a busy server's datastore is the largest thing on the disk, and every backup copies it in full.

A restored instance starts with the same DKIM keys, ACME account and certificate, so no DNS change is needed. What does not come back is StartOS host state: the public domain on the `admin` interface, the enabled public addresses on the mail bindings and the outbound gateway are gone after a restore and have to be re-added, and StartTunnel forgets any manual published port that pointed at one of the withdrawn mappings. If the restore lands on a different public IP, the `A` and PTR records are the only DNS to update. Restoring is only possible while the package is not installed; StartOS refuses to restore over an existing install.

## Limitations and Differences

What this package cannot do, or does differently from a Stalwart installed by hand — most of it follows from StartOS owning the ports below 1025 and the resolver.

1. The standard mail ports (25, 465, 993, 4190) are published on 2525, 10465, 10993 and 14190 and must be mapped on the gateway by the user; nothing in the package can claim them.
2. The mail ports carry Stalwart's own certificate. Until ACME succeeds it is self-signed, and ACME can only succeed once the hostname is a public domain on the `admin` interface with a working `A` record.
3. Outbound delivery uses whatever gateway StartOS routes the service through; if that gateway blocks outbound port 25 (most residential ISPs, some VPS providers) delivery fails and the user needs a relay host, configured in the console.
4. POP3 is disabled.
5. Stalwart's setup wizard is bypassed. Storage backends (PostgreSQL, S3, …), external directories (LDAP, OIDC, SQL) and DNS-provider automation are not offered at setup; all remain available in the console afterwards.
6. Hostname and email domain are set once from StartOS; later changes are made in the console and are not reflected in `store.json`, which only the bootstrap and `show-dns-records`' hostname reminder read.
7. The web console is fetched from GitHub at first start rather than shipped in the image, so the console (not the mail server) depends on outbound HTTPS once.
8. Enterprise-licensed features (LLM spam classification, masked email, multi-tenancy, some telemetry views) are unavailable, as in the community edition upstream.
9. DANE is disabled for outbound delivery: the StartOS resolver forwards queries without DNSSEC validation, and Stalwart turns DANE off rather than defer mail (`registry.build-warning` at every start). The TLSA records in the zone file only help senders if the user's own zone is DNSSEC-signed.
10. Setting the service's outbound gateway (`start-cli package set-outbound-gateway`, or the **Set Outbound Gateway** action) has no effect while a system-wide default gateway is pinned under System › Gateways › Outbound Traffic: the catch-all rule for the pinned default precedes the per-service rule. Pin the system default to the gateway the mail ports are published on, or leave it on Auto.
11. Withdrawing a public address on a mail binding — which a reinstall, an update and a restore all do — makes StartOS release its PCP mapping, and StartTunnel then drops any _manual_ published port whose target is the same device port. The user's `25 → 2525` style rules have to be re-added afterwards.

---

## Quick Reference for AI Consumers

```yaml
package_id: stalwart
image: stalwartlabs/stalwart
architectures: [x86_64, aarch64]
subcontainers: [stalwart-chown, stalwart-sub]
volumes:
  main: /etc/stalwart (etc/), /var/lib/stalwart (data/)
file_models:
  - store.json
  - etc/config.json
startos_managed_env_vars:
  - STALWART_RECOVERY_ADMIN
dependencies: none
interfaces:
  admin: { type: ui, port: 8080 }
  account: { type: ui, port: 8080 }
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
