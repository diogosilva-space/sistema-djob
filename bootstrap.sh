#!/bin/bash

# D.job System - Script de Inicialização Operacional

echo "🚀 Iniciando inicialização do ambiente de desenvolvimento do D.job System..."

# 1. Instalar dependências se a pasta node_modules não existir
if [ ! -d "node_modules" ]; then
  echo "📦 Instalando dependências do monorepo..."
  npm install
else
  echo "✅ Dependências já instaladas."
fi

# 2. Configurar variáveis de ambiente
if [ ! -f ".env" ]; then
  echo "📝 Criando arquivo .env a partir do .env.example..."
  cp .env.example .env
  echo "⚠️ Por favor, ajuste as variáveis de banco no arquivo .env se necessário."
else
  echo "✅ Arquivo .env já existe."
fi

# 3. Aplicar alterações no banco de dados local
echo "🗄️ Sincronizando o banco de dados..."
npx prisma db push --schema=packages/database/prisma/schema.prisma

# 4. Compilar os pacotes compartilhados
echo "🛠️ Compilando pacotes compartilhados..."
npm run build --workspace=@djob/validators
npm run build --workspace=@djob/database

# 5. Executar o Seed (Tenant Demo + Administrador)
echo "🌱 Rodando o seed do banco de dados..."
npm run db:seed

echo "🎉 Ambiente inicializado com sucesso!"
echo "💡 Para rodar o sistema em desenvolvimento, execute: npm run dev"
