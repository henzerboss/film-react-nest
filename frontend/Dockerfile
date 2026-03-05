FROM node:20-alpine AS builder

RUN npm i -g npm@11.11.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine:3.20 AS export

WORKDIR /export

COPY --from=builder /app/dist ./dist

RUN printf '%s\n' \
  '#!/bin/sh' \
  'set -e' \
  'rm -rf /dist/*' \
  'cp -r /export/dist/* /dist/' \
  'echo "Frontend dist exported to /dist"' \
  > /entrypoint.sh \
  && chmod +x /entrypoint.sh

VOLUME ["/dist"]
ENTRYPOINT ["/entrypoint.sh"]