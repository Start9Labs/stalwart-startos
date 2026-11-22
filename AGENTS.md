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
`instructions.md` (end-user docs) in sync with your changes. This file restates neither:
whoever changes the package has both, so it carries only what they don't — repo mechanics,
a change that looks right and is not, where the next thing gets added, a naming trap, a
build or test invocation particular to this repo.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **Make the package's own JMAP calls only inside `withMaintenanceStalwart`, and never persist, log or pass on its password** — that run is the only time a recovery admin exists, and its random password is all that guards it: Stalwart binds the recovery listener to `[::]`, so other services on the server can reach port 18080.
- **Keep every maintenance run but the second bootstrap run in recovery mode; don't call `clearBindings` from `main`** — disabling a binding withdraws its onion and I2P addresses, which changes the console's redirect list and re-runs the maintenance in a loop.
- **Never store the admin password, only `adminPasswordHash`, and delete the hash once the maintenance run has applied it** — reapplying it on every start would clear the account's two-factor secret and end its sessions each time.
- **Actions that need the API ask the user for the admin password** — the package holds no credential while Stalwart serves.
- **Read the console's addresses inside `Daemons.dynamic` and hand them to the `maintenance` oneshot through `uses`, never with `.const()` in `setupMain`'s outer scope** — the outer scope would tear down the whole daemon set instead of re-running the maintenance and restarting Stalwart.
- **Keep `admin` and `account` on the 8081 binding and `jmap-dav` on 8080, and keep the `allowedEndpoints` rule keyed on local port 8080** — only the 8080 binding holds 443, which `.well-known`, autoconfig and Stalwart's HTTP-01 challenge need, and the rule is what keeps the console's pages off the public domain.
- **Build the console OAuth client's redirect URIs only from the `admin` and `account` interfaces' enabled HTTPS addresses** — that list is the user's control over where the console accepts sign-in.
- **Gate bootstrap on `etc/config.json` being absent, never on `kind === 'install'`** — the hostname, domain and password arrive from actions after install.
- **Don't set `STALWART_PUBLIC_URL` to make the console log in** — it would pin JMAP/OIDC discovery to one address for every mail client.
- **Keep every mail port a plain DNAT binding (`secure: { ssl: false }`); don't move one to `addSsl` or passthrough (`ssl: true`)** — termination makes every mail client look like the proxy to Stalwart's rate limiting and auto-ban, and passthrough's SNI listener refuses names not enabled on each mail port.
- **Change a published port (2525, 10465, 10993, 14190) only together with the table in `instructions.md`** — the user maps the standard ports to them once on their gateway.
- **Keep the second bootstrap run a normal-mode start, not recovery mode** — only a normal start provisions the default listeners, including the `pop3s` one bootstrap deletes.
- **Don't drop `armAcme` from the maintenance run in `main` or gate it on install** — Stalwart backs its own retries off exponentially and never reschedules a locked or failed renewal, so `armAcme` is what makes a restart retry issuance at once.
- **Keep `armAcme` creating the `AcmeRenewal` singleton, not destroying and recreating it** — upstream forbids destroying an automatic domain's renewal task.
- **Don't drop or lower the `0.16.27:0` floor in `startos/versions/`** — `stalwart-migrate` reads only 0.16.27 stores, and the floor is what makes StartOS route older 0.16 installs through 0.16.27:1.
