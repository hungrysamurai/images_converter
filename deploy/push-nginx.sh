#!/usr/bin/env bash
# Pushes deploy/nginx/ to this project's own folder on the server and reloads nginx.
# The server is shared: --delete must stay limited to /etc/nginx/projects/convert-it.ru.
#
#   DEPLOY_HOST  required, [user@]host or an ~/.ssh/config alias. Taken from the
#                environment, otherwise from .env.local
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ -z "${DEPLOY_HOST:-}" && -f .env.local ]]; then
  DEPLOY_HOST="$(sed -n 's/^DEPLOY_HOST=//p' .env.local | tr -d "\r\"'")"
fi

if [[ -z "${DEPLOY_HOST:-}" ]]; then
  echo "DEPLOY_HOST is not set (export it or add it to .env.local)" >&2
  exit 1
fi

rsync --recursive --links --chmod=D755,F644 --checksum --delete --itemize-changes \
  deploy/nginx/ "$DEPLOY_HOST:/etc/nginx/projects/convert-it.ru/"

ssh "$DEPLOY_HOST" 'nginx -t && systemctl reload nginx'
