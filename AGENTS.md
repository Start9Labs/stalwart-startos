# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`STALWART_RECOVERY_ADMIN` is the package's admin credential, on purpose.** Upstream's docs call it a backdoor to remove after setup; here it is the one credential StartOS owns — it bypasses the account directory, so `set-admin-password` can always get the user back in. Don't replace it with the `admin@<domain>` account bootstrap creates, and don't add a "show password" action: the set action is the only owner.
- **Bootstrap runs from init, keyed on `etc/config.json` being absent — not on `kind === 'install'`.** The hostname, domain and password arrive from actions after install, and an init handler re-runs when the store it `.const()`s changes. Gating it on install would run it before any of them exist.
- **Don't set `STALWART_PUBLIC_URL` to make the console log in.** It already works at every StartOS address: the proxied session is plain HTTP, and on a plain session Stalwart's `/api/discover` returns path-relative OAuth endpoints. Setting the variable would pin JMAP/OIDC discovery to one address for every mail client instead.
- **Every mail port is a plain DNAT binding (`secure: { ssl: false }`), including the implicit-TLS ones; don't move any of them to `addSsl` or to passthrough (`ssl: true`).** A terminated raw binding reaches the container from the proxy's address, so Stalwart would rate-limit, auto-ban and log every mail client as `10.0.3.1`. Passthrough puts StartOS's SNI listener in front, which by design answers only to names enabled on that binding — so a mail client's SNI fails until the user has also enabled the domain on each mail port, a second toggle per port that nothing prompts for.
- **The published ports (2525, 10465, 10993, 14190) are a contract with `instructions.md`.** The user maps the standard ports to them once on their gateway; change one and change the table there.
- **The second bootstrap run has to be a normal-mode start, not recovery mode.** Bootstrap mode exposes only the `Bootstrap` object, and recovery mode has the management API but no listeners yet — Stalwart provisions its default `NetworkListener`s on the first normal start, so that is the only run in which the `pop3s` listener exists to be deleted.
- **The `acme` oneshot in `main` is not redundant with Stalwart's own renewal.** Stalwart creates its renewal task exactly once, when a domain is switched to automatic certificate management; a task locked by the killed bootstrap instance sleeps for an hour, a failed one is never retried, and a restart reschedules nothing. The oneshot is what makes "restart to retry issuance" true — it only acts while no unexpired certificate covers the hostname, so don't gate it on install or drop it.
