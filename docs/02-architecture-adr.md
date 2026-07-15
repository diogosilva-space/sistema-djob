# ADR #001: Arquitetura Core e Stack Tecnológica

**Data:** 14 de Julho de 2026
**Status:** APROVADO
**Projeto:** D.job System (ERP/CRM Híbrido)

## 1. Contexto e Problema

A DJOB opera com **Mixed-Mode Manufacturing** (MTS - Make to Stock para brindes, e CTO - Configure to Order para confecção). O sistema precisa suportar orçamentos flexíveis, renderização imediata de tabelas complexas e cálculos em tempo real sem degradar a performance no navegador do usuário.

## 2. Decisão Arquitetural

### 2.1. Frontend Layer

- **Framework:** Next.js 15+ (App Router) com React 19.
- **Linguagem:** TypeScript (Strict Mode = true).
- **Estilização:** Tailwind CSS v4.
- **UI Components:** Shadcn/ui (Estilo 'New York', sem animações excessivas ou glassmorphism). Font-family exclusiva: `Inter`.
- **State & Data Fetching:** TanStack Query v5 (Cache global) e Zustand (Estado local leve).
- **Data Tables:** TanStack Table v8.
- **Formulários:** React Hook Form + Zod (Validação em tempo real no cliente).

### 2.2. Backend Layer

- **Framework:** NestJS (Node.js/TypeScript). Arquitetura modular separando CRM, Vendas, Estoque, PCP, Financeiro e RH.
- **API Paradigm:** RESTful API documentada via OpenAPI/Swagger.
- **Real-time:** WebSockets (Socket.io) restrito apenas para o painel de PCP no chão de fábrica.

### 2.3. Data Layer

- **Database:** PostgreSQL 17+.
- **ORM:** Prisma ORM. Utilizado pela sua tipagem segura e capacidade de lidar com chaves JSONB (essencial para as especificações variáveis dos orçamentos).

## 3. Consequências e Restrições

- **Proibido:** GraphQL e tRPC. Toda a comunicação deve ser feita via REST para facilitar integrações externas (NF-e, WhatsApp).
- **Proibido:** Single Page Application (SPA) clássica (Vite/CRA). Todo o roteamento é gerenciado pelo Next.js App Router para beneficiar-se de Server Components.
