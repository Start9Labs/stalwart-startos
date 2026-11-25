ARG IMAGE
FROM ${IMAGE}
ARG WEBUI_VERSION
ARG WEBUI_SHA256
ADD --checksum=sha256:${WEBUI_SHA256} --chmod=644 https://github.com/stalwartlabs/webui/releases/download/${WEBUI_VERSION}/webui.zip /opt/webui.zip
