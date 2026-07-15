#!/usr/bin/env bash
set -euo pipefail

readonly LOCAL_PORT=5433
readonly ORACLE_HOST="147.15.125.25"
readonly ORACLE_USER="ubuntu"
readonly REMOTE_DATABASE_HOST="127.0.0.1"
readonly REMOTE_DATABASE_PORT=5432

if ! command -v ssh >/dev/null 2>&1; then
  echo "Erro: o comando ssh não está disponível." >&2
  exit 1
fi

if lsof -nP -iTCP:"${LOCAL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Erro: a porta local ${LOCAL_PORT} já está em uso." >&2
  echo "Finalize o processo atual ou use o túnel já aberto." >&2
  exit 1
fi

echo "Túnel do PostgreSQL de produção ativo em localhost:${LOCAL_PORT}."
echo "Mantenha este terminal aberto enquanto usar npm run dev."

exec ssh \
  -N \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=60 \
  -o ServerAliveCountMax=3 \
  -L "${LOCAL_PORT}:${REMOTE_DATABASE_HOST}:${REMOTE_DATABASE_PORT}" \
  "${ORACLE_USER}@${ORACLE_HOST}"
