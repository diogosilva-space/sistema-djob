#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPOSITORY_ROOT="$(cd "${SCRIPT_DIRECTORY}/.." && pwd)"

cd "${REPOSITORY_ROOT}"

set -a
source .env
set +a

exec npx tsx packages/database/prisma/seed.ts
