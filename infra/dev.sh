#!/usr/bin/env bash
set -euo pipefail

readonly TUNNEL_PORT=5433
readonly TUNNEL_SCRIPT="./infra/tunnel.sh"

tunnel_pid=""

cleanup() {
  if [[ -n "${tunnel_pid}" ]] && kill -0 "${tunnel_pid}" 2>/dev/null; then
    echo ""
    echo "Encerrando túnel temporário do banco..."
    kill "${tunnel_pid}" 2>/dev/null || true
    wait "${tunnel_pid}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if lsof -nP -iTCP:"${TUNNEL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Usando túnel PostgreSQL já ativo em localhost:${TUNNEL_PORT}."
else
  "${TUNNEL_SCRIPT}" &
  tunnel_pid=$!

  for _ in {1..20}; do
    if lsof -nP -iTCP:"${TUNNEL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
      break
    fi

    if ! kill -0 "${tunnel_pid}" 2>/dev/null; then
      echo "Erro: não foi possível abrir o túnel do PostgreSQL." >&2
      exit 1
    fi

    sleep 0.25
  done

  if ! lsof -nP -iTCP:"${TUNNEL_PORT}" -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Erro: o túnel do PostgreSQL não respondeu a tempo." >&2
    exit 1
  fi
fi

npx turbo dev
