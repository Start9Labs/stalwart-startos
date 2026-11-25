# Updating the upstream version

This package uses the Docker image upstream publishes for each release of [stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart), pinned by its full version tag. "Upstream" is that repository; the image is `stalwartlabs/stalwart` on Docker Hub.

## Determining the upstream version

- **Stalwart** ([stalwartlabs/stalwart](https://github.com/stalwartlabs/stalwart)) — inspect the tags and stable releases rather than relying on GitHub's "Latest" badge:

  ```sh
  gh api 'repos/stalwartlabs/stalwart/tags?per_page=100' --jq '.[].name'
  gh api 'repos/stalwartlabs/stalwart/releases?per_page=100' --jq '.[] | select(.draft == false and .prerelease == false) | .tag_name'
  ```

  Choose the highest stable version whose image is published for both supported architectures. If its image is not yet published, try the next newest stable release.

  The current pin lives in `startos/manifest/index.ts` at `images.stalwart.source.dockerBuild.buildArgs.IMAGE`, as `stalwartlabs/stalwart:<tag>` with the tag's leading `v` kept. Confirm the tag is on Docker Hub for both architectures before pinning it:

  ```sh
  curl -fsSL https://hub.docker.com/v2/repositories/stalwartlabs/stalwart/tags/<tag> \
    | jq -r '.images[] | select(.os == "linux") | .architecture'
  ```

## Applying the bump

- Bump `IMAGE` in `images.stalwart.source.dockerBuild.buildArgs` in `startos/manifest/index.ts`.
- `stalwart-migrate` is pinned in `startos/manifest/index.ts` at `images.migrate.source.dockerBuild.buildArgs.IMAGE`. It moves only when a fix in it matters to the 0.16 migration; a new pin must be checked against a 0.16.27 store the package bootstrapped, by running its `prepare` interactively and comparing the questions with the answers in `startos/versions/v1.0.0_0.ts`.
- The web console is a separate bundle ([stalwartlabs/webui](https://github.com/stalwartlabs/webui)), built into the image from `WEBUI_VERSION` and `WEBUI_SHA256` beside `IMAGE`. Check it on every bump: take the highest stable `v2.x.y` release (never the moving `v2` tag), confirm its `stalwart-app.json` `minServerVersion` is at or below the Stalwart being pinned, and pin the tag with its asset's sha256. Stalwart 1.x requires a version 2 console bundle.

  ```sh
  gh api 'repos/stalwartlabs/webui/releases?per_page=20' \
    --jq '.[] | select(.draft == false and .prerelease == false) | "\(.tag_name) \(.assets[] | select(.name == "webui.zip") | .digest)"'
  curl -fsSL -o webui.zip https://github.com/stalwartlabs/webui/releases/download/<tag>/webui.zip
  sha256sum webui.zip && unzip -p webui.zip stalwart-app.json
  ```

  The build fails if the download does not match `WEBUI_SHA256`.
