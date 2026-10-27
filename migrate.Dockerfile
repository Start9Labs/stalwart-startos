# docker save --platform rejects the published image's index; a local build exports cleanly.
ARG IMAGE
FROM ${IMAGE}
