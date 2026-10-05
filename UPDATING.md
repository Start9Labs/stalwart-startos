# Updating the upstream version

This package wraps the Docker image upstream publishes for each release of [stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart), pinned by its full version tag. "Upstream" is that repository; the image is `stalwartlabs/stalwart` on Docker Hub.

## Determining the upstream version

- **Stalwart** ([stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart)) — inspect the tags and stable releases rather than relying on GitHub's "Latest" badge:

  ```sh
  gh api 'repos/stalwartlabs/stalwart/tags?per_page=100' --jq '.[].name'
  gh api 'repos/stalwartlabs/stalwart/releases?per_page=100' --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name'
  ```

  Choose the highest stable version whose image is published for both supported architectures. If its image is not yet published, try the next newest stable release.

  The current pin lives in `startos/manifest/index.ts` at `images.stalwart.source.dockerTag`, as `stalwartlabs/stalwart:<tag>` with the tag's leading `v` kept. Confirm the tag is on Docker Hub for both architectures before pinning it:

  ```sh
  docker manifest inspect stalwartlabs/stalwart:<tag> | jq -r '.manifests[].platform.architecture'
  ```

## Applying the bump

- Bump `dockerTag` in `startos/manifest/index.ts` and `version` in `startos/versions/current.ts` (`<upstream without the v>:0`).
- A patch release (`0.16.x` → `0.16.y`) is a drop-in upgrade; upstream says so and asks for nothing else.
- A minor or major release may change the datastore or the configuration model. Read the release's notes and, if one exists for it, the `UPGRADING/` document in the upstream repository before bumping. The 0.15 → 0.16 upgrade replaced the configuration system entirely and needed a manual migration; treat any future one the same way, and give the package a migration in `startos/versions/` if the upgrade needs steps the image does not take on its own.
- The web console is a separate bundle ([stalwartlabs/webui](https://github.com/stalwartlabs/webui)) that the server downloads from that repository's latest release at runtime, so it is not pinned here and needs no bump.
