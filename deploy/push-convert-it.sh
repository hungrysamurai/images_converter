#!/usr/bin/env bash
# Pushes the convert-it.ru build to the server over rsync+ssh.
#
#   DEPLOY_HOST  required, [user@]host or an ~/.ssh/config alias. Taken from the
#                environment, otherwise from .env.local
#   DEPLOY_PATH  optional, defaults to the nginx root in deploy/nginx/site.conf
#
# Usage: deploy/push-convert-it.sh [--dry-run]
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

BUILD_DIR=convert-it.ru

if [[ -z "${DEPLOY_HOST:-}" && -f .env.local ]]; then
  DEPLOY_HOST="$(sed -n 's/^DEPLOY_HOST=//p' .env.local | tr -d "\r\"'")"
fi
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/convert-it.ru}"

if [[ -z "${DEPLOY_HOST:-}" ]]; then
  echo "DEPLOY_HOST is not set (export it or add it to .env.local)" >&2
  exit 1
fi

# With --delete, an empty source would wipe the site
if [[ ! -f "$BUILD_DIR/index.html" || ! -d "$BUILD_DIR/assets" ]]; then
  echo "No build in $BUILD_DIR/, run: pnpm build:convert-it.ru" >&2
  exit 1
fi

dry_run=()
case "${1:-}" in
  '') ;;
  -n | --dry-run) dry_run=(--dry-run) ;;
  *)
    echo "Usage: $0 [--dry-run]" >&2
    exit 1
    ;;
esac

echo "Pushing $BUILD_DIR/ to $DEPLOY_HOST:$DEPLOY_PATH/${dry_run:+ (dry run)}"

# --delay-updates + --delete-delay: files are swapped in together at the end and
#   old chunks go last, so index.html never points at a chunk that is not there yet.
# --filter 'P /*': top-level entries missing from the build (.well-known, robots.txt,
#   verification files) survive --delete, stale hashed files inside assets/ do not.
rsync \
  --recursive --links --perms \
  --chmod=D755,F644 \
  --checksum --compress --itemize-changes \
  --delay-updates --delete-delay \
  --filter='P /*' \
  "${dry_run[@]}" \
  "$BUILD_DIR/" "$DEPLOY_HOST:$DEPLOY_PATH/"
