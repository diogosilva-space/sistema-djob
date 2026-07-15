#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPOSITORY_ROOT="$(cd "${SCRIPT_DIRECTORY}/.." && pwd)"
readonly COMMAND="${1:-}"

case "${COMMAND}" in
  deploy | status) ;;
  *)
    echo "Uso: bash infra/run-prisma-migration.sh <deploy|status>" >&2
    exit 1
    ;;
esac

cd "${REPOSITORY_ROOT}"

set -a
source .env
set +a

exec npx prisma migrate "${COMMAND}" --schema=packages/database/prisma/schema.prisma
