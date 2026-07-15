# 🚀 D.job System — ERP/CRM Industrial Multitenant

Este é o sistema integrado de gestão (ERP/CRM) para a **D.job Brindes e Confecção**, arquitetado como um Monorepo utilizando **Turborepo** e estruturado para alta escalabilidade e segurança multitenant com Row Level Security (RLS) simulado.

---

## 📋 Sumário

- [Estrutura do Monorepo](#-estrutura-do-monorepo)
- [Stack Tecnológica](#%EF%B8%8F-stack-tecnol%C3%B3gica)
- [Instalação e Uso](#-instala%C3%A7%C3%A3o-e-uso)
- [Banco de Dados (Prisma)](#-banco-de-dados-prisma)
- [Módulos Implementados](#-m%C3%B3dulos-implementados)
- [Segurança & Auditoria](#-seguran%C3%A7a--auditoria)

---

## 📁 Estrutura do Monorepo

```
/ (raiz)
├── apps/
│   ├── api/            # Backend NestJS (REST API)
│   └── web/            # Frontend Next.js (App Router)
├── packages/
│   ├── database/       # Prisma ORM & Client compilado
│   └── validators/     # Validadores Zod compartilhados
├── package.json        # Configuração de workspaces npm
└── turbo.json          # Configuração de pipelines do Turborepo
```

---

## 🛠️ Stack Tecnológica

### Core e Serviços

- **Next.js 15+ (App Router)** - Framework frontend.
- **NestJS 11+** - Backend escalável com injeção de dependências.
- **Prisma ORM & PostgreSQL** - Camada de banco de dados robusta.
- **Zod** - Validadores de dados compartilhados entre front e back.
- **Turborepo** - Orquestrador de build e cache do monorepo.

---

## 🚀 Instalação e Uso

### Pré-requisitos

- Node.js >= 20.0.0
- Docker (para banco de dados PostgreSQL)

### Passos para Configuração

1.  **Clone o repositório e instale as dependências:**
    ```bash
    npm install
    ```
2.  **Configure as variáveis de ambiente:**
    Copie o arquivo `.env.example` para `.env` na raiz do monorepo e configure a `DATABASE_URL`.
3.  **Execute o banco de dados via Docker Compose (ou local):**
    ```bash
    docker compose up -d
    ```
4.  **Sincronize o banco de dados e gere o client Prisma:**
    ```bash
    npx prisma db push --schema=packages/database/prisma/schema.prisma
    npm run db:seed
    ```
5.  **Inicie o servidor de desenvolvimento global:**
    ```bash
    npm run dev
    ```

---

## 🗄️ Banco de Dados (Prisma)

Toda a modelagem está centralizada em `packages/database/prisma/schema.prisma`.
Os comandos de banco de dados podem ser executados com:

- `npm run db:generate` - Regenera os clientes do Prisma.
- `npm run db:seed` - Cria o tenant demo e o usuário administrativo padrão (`admin@demo.com` / `admin123`).

---

## 📦 Módulos Implementados

1.  **Dashboard:** KPI Cards unificados.
2.  **CRM:** Cadastro de Clientes e Fornecedores.
3.  **Vendas:** Fluxo completo de Orçamentos e Pedidos de Venda.
4.  **Produtos:** Catálogo geral, insumos e Fichas Técnicas (BOM).
5.  **Produção (PCP):** Chão de fábrica com apontamento de etapas e perdas.
6.  **Estoque:** Saldo, histórico de movimentações e baixa automática via Ficha Técnica (BOM).
7.  **Compras:** Geração de Pedidos de Compra e recebimento de insumos.
8.  **Financeiro:** Contas a pagar/receber e liquidação direta ("Quitar").
9.  **Recursos Humanos (RH):** Cadastro de funcionários com tabs e controle salarial.

---

## 🛡️ Segurança & Auditoria

- **Multi-tenant RLS (Row Level Security):** O `TenantInterceptor` do backend intercepta as requisições, validando o `tenantId` contido no token JWT do usuário ativo, garantindo isolamento absoluto dos dados.
- **RBAC (Role Based Access Control):** Rotas confidenciais (ex: Financeiro, RH) são protegidas estritamente com `RolesGuard`.
- **AuditLog:** Tabela de auditoria permanente monitorando transações financeiras e alterações salariais.
