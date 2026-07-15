#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIRECTORY="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPOSITORY_ROOT="$(cd "${SCRIPT_DIRECTORY}/.." && pwd)"

cd "${REPOSITORY_ROOT}"

if [[ $# -ne 1 ]] || [[ ! $1 =~ ^[a-z][a-z0-9_]*$ ]]; then
  echo "Uso: npm run db:migrate:create -- nome_descritivo" >&2
  echo "Use apenas letras minúsculas, números e underscores." >&2
  exit 1
fi

readonly MIGRATION_NAME="$1"
readonly SCHEMA_PATH="packages/database/prisma/schema.prisma"
readonly MIGRATIONS_PATH="packages/database/prisma/migrations"
readonly MIGRATION_ID="$(date -u +%Y%m%d%H%M%S)_${MIGRATION_NAME}"
readonly MIGRATION_PATH="${MIGRATIONS_PATH}/${MIGRATION_ID}"
readonly MIGRATION_FILE="${MIGRATION_PATH}/migration.sql"

set -a
source .env
set +a

if ! nc -z 127.0.0.1 5433 >/dev/null 2>&1; then
  echo "Erro: o túnel de produção não está ativo em localhost:5433." >&2
  echo "Abra outro terminal e execute ./infra/tunnel.sh." >&2
  exit 1
fi

if [[ -e "${MIGRATION_PATH}" ]]; then
  echo "Erro: a migration ${MIGRATION_ID} já existe." >&2
  exit 1
fi

mkdir -p "${MIGRATION_PATH}"

if ! npx prisma migrate diff \
  --from-url "${DATABASE_URL:?DATABASE_URL não definida}" \
  --to-schema-datamodel "${SCHEMA_PATH}" \
  --script >"${MIGRATION_FILE}"; then
  rm -rf "${MIGRATION_PATH}"
  exit 1
fi

echo "Migration criada: ${MIGRATION_FILE}"
echo "Revise o SQL antes de aplicar com: npm run db:migrate"
