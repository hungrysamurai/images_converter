#!/usr/bin/env bash
# Pushes deploy/nginx/ to the server. nginx-project-apply (installed by the common-thought
# repo) activates it and reloads nginx, or restores the previous config if nginx -t fails.
# The server is shared: --delete must stay limited to this project's own folder.
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
  deploy/nginx/ "$DEPLOY_HOST:/var/lib/nginx-projects/convert-it.ru/"

ssh "$DEPLOY_HOST" nginx-project-apply convert-it.ru
