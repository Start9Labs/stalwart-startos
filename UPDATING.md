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
- Read the release's notes and any migration documentation it links.
- The first bump after 1.0.0 must move `current.ts` to `v1.0.0.0.ts` before editing it: that version carries the 0.16 migration.
- `stalwart-migrate` is pinned in `startos/manifest/index.ts` at `images.migrate.source.dockerBuild.buildArgs.IMAGE`. It moves only when a fix in it matters to the 0.16 migration; a new pin must be checked against a 0.16.27 store the package bootstrapped, by running its `prepare` interactively and comparing the questions with the answers in `current.ts` (or `v1.0.0.0.ts`).
- The web console is a separate bundle ([stalwartlabs/webui](https://github.com/stalwartlabs/webui)) that the server downloads at runtime, so it is not pinned here and needs no bump. Stalwart 1.x requires a version 2 console bundle.
