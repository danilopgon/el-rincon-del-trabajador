#!/usr/bin/env bash
# Runs on the hosting server after the deploy job has uploaded the build to <docroot>/<staging>.
# Syncs it into the docroot but keeps previous hashed assets in /_astro/: SiteGround's page cache
# can keep serving older HTML for hours, and that HTML must still find its CSS and JS.
#
# Usage: publish-remote.sh <docroot> <staging-dir-name>
set -euo pipefail

docroot="${1:?docroot required}"
staging="${2:?staging dir name required}"
docroot="${docroot%/}"
max_asset_age_days="${ASSET_MAX_AGE_DAYS:-30}"

if [ -z "$docroot" ] || [ "$docroot" = "/" ]; then
  echo "Refusing to publish into '$1'" >&2
  exit 1
fi
if [ ! -d "$docroot" ] || [ ! -d "$docroot/$staging" ]; then
  echo "Missing docroot or staging directory: $docroot/$staging" >&2
  exit 1
fi
if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is not available on the server; nothing was published" >&2
  exit 1
fi

# Prune before syncing, while the new build's file list is still at hand: only assets that are
# old AND not part of the new build go, so a file the current pages use is never removed.
# Piped, not fed by process substitution: the host shell has no /dev/fd for it.
if [ -d "$docroot/_astro" ]; then
  find "$docroot/_astro" -type f -mtime "+$max_asset_age_days" -print0 |
    while IFS= read -r -d '' asset; do
      if [ ! -e "$docroot/$staging/_astro/${asset#"$docroot/_astro/"}" ]; then
        rm -f "$asset"
      fi
    done
fi

# --checksum compares content, not size and mtime. --delete removes pages that no longer
# exist; the protect filters keep old assets and the staging directory (inside the docroot).
rsync -a --checksum --delete \
  --filter="P /_astro/**" \
  --filter="P /.deploy-*" \
  "$docroot/$staging/" "$docroot/"

rm -rf "${docroot:?}/$staging"
# Deploys never overlap (workflow concurrency group), so any other staging folder is
# what a failed deploy left behind.
find "$docroot" -mindepth 1 -maxdepth 1 -type d -name '.deploy-*' -exec rm -rf {} +
