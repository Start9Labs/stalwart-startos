# Updating the upstream version

This package uses the Docker image upstream publishes for each release of [stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart), pinned by its full version tag. "Upstream" is that repository; the image is `stalwartlabs/stalwart` on Docker Hub.

## Determining the upstream version

- **Stalwart** ([stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart)) — inspect the tags and stable releases rather than relying on GitHub's "Latest" badge:

  ```sh
  gh api 'repos/stalwartlabs/stalwart/tags?per_page=100' --jq '.[].name'
  gh api 'repos/stalwartlabs/stalwart/releases?per_page=100' --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name'
  ```

  Choose the highest stable version whose image is published for both supported architectures. If its image is not yet published, try the next newest stable release.

  The current pin lives in `startos/manifest/index.ts` at `images.stalwart.source.dockerTag`, as `stalwartlabs/stalwart:<tag>` with the tag's leading `v` kept. Confirm the tag is on Docker Hub for both architectures before pinning it:

  ```sh
  curl -fsSL https://hub.docker.com/v2/repositories/stalwartlabs/stalwart/tags/<tag> \
    | jq -r '.images[] | select(.os == "linux") | .architecture'
  ```

## Applying the bump

- Bump `dockerTag` in `startos/manifest/index.ts` and `version` in `startos/versions/current.ts` (`<upstream without the v>:0`).
- Follow the packaging guide's scrutiny tiers, including major-review scope for pre-1.0 minor jumps. Upstream's breaking changes and data migrations override a numeric patch classification.
- Read the release's notes and any migration documentation it links. Stalwart 1.0 cannot open 0.16.x data in place: its database layout and settings schema changed. The package intentionally forbids that version edge (`up: IMPOSSIBLE`); do not restore an empty `up` on a later bump without integrating a migration path. That restriction must remain in the release notes while the package is fresh-install-only.
- Upstream's [stalwart-migrate](https://github.com/stalwartlabs/stalwart-migrate) copies 0.16.27 data into a separate empty 1.x store. Its `prepare` step requires operator decisions for customized settings; `prepare --non-interactive` validates existing answers, not automatic defaults. A future integrated migration must preserve the source, provide operator preparation, retain progress for retries, require a successful final copy and verification before switching stores, and account for disk space, downtime, search reindexing and client resynchronization. Older package releases also need to reach 0.16.27 before conversion.
- The web console is a separate bundle ([stalwartlabs/webui](https://github.com/stalwartlabs/webui)) that the server downloads at runtime, so it is not pinned here and needs no bump. Stalwart 1.x requires a version 2 console bundle.
