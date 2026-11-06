#!/usr/bin/env bash
# Pushes the portfolio copy (pnpm build) to hungrysamurai.ru over rsync+ssh. nginx there serves
# every folder of projects/ by itself, so there is no config to apply.
#
#   PORTFOLIO_HOST  required, [user@]host or an ~/.ssh/config alias
#   PORTFOLIO_PORT  optional ssh port, defaults to 22
#                   Both are taken from the environment, otherwise from .env.local
#
# Usage: deploy/push-portfolio.sh [--dry-run]
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

BUILD_DIR=build
BASE_PATH=/projects/images_converter
DEPLOY_PATH="/srv/hungrysamurai$BASE_PATH"

env_local() {
  if [[ -f .env.local ]]; then sed -n "s/^$1=//p" .env.local | tr -d "\r\"'"; fi
}

PORTFOLIO_HOST="${PORTFOLIO_HOST:-$(env_local PORTFOLIO_HOST)}"
PORTFOLIO_PORT="${PORTFOLIO_PORT:-$(env_local PORTFOLIO_PORT)}"
PORTFOLIO_PORT="${PORTFOLIO_PORT:-22}"

if [[ -z "$PORTFOLIO_HOST" ]]; then
  echo "PORTFOLIO_HOST is not set (export it or add it to .env.local)" >&2
  exit 1
fi

# With --delete, an empty source would wipe the project. A build for another base path would
# ask for its files at the root of the site.
if [[ ! -f "$BUILD_DIR/index.html" || ! -d "$BUILD_DIR/assets" ]] ||
  ! grep -q "$BASE_PATH/assets/" "$BUILD_DIR/index.html"; then
  echo "No build for $BASE_PATH in $BUILD_DIR/, run: pnpm build" >&2
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

echo "Pushing $BUILD_DIR/ to $PORTFOLIO_HOST:$DEPLOY_PATH/${dry_run:+ (dry run)}"

# --delay-updates + --delete-delay: files are swapped in together at the end and
#   old chunks go last, so index.html never points at a chunk that is not there yet.
# The folder holds this build and nothing else, so it is mirrored exactly.
rsync \
  --recursive --links --perms \
  --chmod=D755,F644 \
  --checksum --compress --itemize-changes \
  --delay-updates --delete-delay \
  --rsh="ssh -p $PORTFOLIO_PORT" \
  "${dry_run[@]}" \
  "$BUILD_DIR/" "$PORTFOLIO_HOST:$DEPLOY_PATH/"
