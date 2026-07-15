# Dashboard — KPIs, Gráficos e Evolução Analítica

**Data:** 15 de Julho de 2026  
**Status:** P0 IMPLEMENTADA — P1 e P2 PLANEJADAS  
**Projeto:** D.job System (ERP/CRM Híbrido)

> Este documento define o escopo analítico do cockpit em `/dashboard`. Ele consolida o dashboard legado, a documentação funcional e os dados disponíveis hoje no schema Prisma e APIs.

## 1. Estado atual

O dashboard em `apps/web/src/app/(app)/dashboard/page.tsx` consulta o endpoint agregado `GET /api/dashboard/summary` com React Query. A agregação ocorre no backend por `tenantId`, sem transferir listas completas para o navegador.

- Quatro KPIs operacionais;
- Dois gráficos com dados reais;
- Últimos pedidos;
- Alertas operacionais;
- Ações rápidas para Vendas, PCP e Estoque.

O legado possui gráficos em `_legacy/src/components/DashboardCharts.tsx`, porém usa dados mock. A implementação atual usa dados reais do PostgreSQL.

## 2. Fase P0 — Cockpit operacional

Implementada em `apps/api/src/dashboard/` e `apps/web/src/features/dashboard/`.

### Cards de KPI

| KPI | Fonte | Cálculo |
|---|---|---|
| Faturamento do mês | `SalesOrder.totalAmount`, `createdAt` | Soma do período selecionado |
| Pedidos em aberto | `SalesOrder.status` | Status `PENDING`, `CONFIRMED`, `IN_PRODUCTION`, `READY` ou `SHIPPED` |
| OPs em andamento | `ProductionOrder.status` | Status `PLANNED`, `IN_PROGRESS` ou `PAUSED` |
| Estoque crítico | `StockItem.quantity`, `Product.minStock` | Itens com saldo menor ou igual ao mínimo |

### Gráficos

| Gráfico | Tipo | Fonte |
|---|---|---|
| Evolução do faturamento | Linha/área; últimos 6 meses | Pedidos agrupados por `createdAt` |
| Vendas por categoria/tipo | Donut | Itens de pedidos agrupados por produto/categoria |

### Listas operacionais

| Lista | Conteúdo |
|---|---|
| Últimos pedidos | Pedidos mais recentes, cliente, status e valor |
| Alertas do sistema | Estoque crítico, pedidos vencidos e OPs com prazo vencido |

## 3. Fase P1 — Comercial e CRM

- Novos clientes no período (`Customer.createdAt`);
- Orçamentos pendentes e taxa de conversão (`Quote.status`);
- Gráfico de orçamentos enviados, aprovados e convertidos por mês;
- Pipeline ativo em valor e oportunidades quentes, após criar API para `Opportunity`;
- Tarefas de CRM por usuário, após modelar `CrmTask` ou `Activity`.

## 4. Fase P2 — Financeiro resumido

- Contas a receber, a pagar e vencidas (`FinancialTransaction`);
- Fluxo de receitas e despesas no período;
- Link contextual para o módulo Financeiro.

Margem líquida, DRE, custo de produção e rentabilidade por pedido pertencem a um módulo de relatórios/BI, não ao cockpit diário.

## 5. Contrato técnico implementado

`GET /api/dashboard/summary?from=&to=` é protegido por JWT e consolida os dados pelo `tenantId` do usuário autenticado.

- `from` e `to` são opcionais, em ISO 8601; sem parâmetros, o KPI de faturamento usa o mês corrente.
- A série de faturamento sempre retorna os seis meses anteriores até `to`.
- Pedidos cancelados não participam do faturamento, dos gráficos ou da lista de pedidos recentes.
- O gráfico de tipo classifica `ProductType.SIMPLE` como **Brindes**, `ProductType.CONFIGURABLE` como **Confecção** e os demais como **Outros**.
- Os alertas exibem, no máximo, cinco itens entre estoque crítico, pedidos atrasados e OPs vencidas.

```text
DashboardSummary
  kpis: revenue, openOrders, activeProductionOrders, criticalStock
  revenueSeries: month, amount
  salesByProductType: name, amount
  recentOrders: id, code, customerName, status, totalAmount, createdAt, deliveryDate
  alerts: id, severity, title, description, href
```

O contrato compartilhado está em `packages/validators/src/dashboard.ts`; o frontend o consome com `dashboardApi` e React Query. A rota é exposta na documentação Swagger em `/api/docs`.

Comparativos com o período anterior serão incluídos nesse endpoint na P1, não no frontend.

## 6. Lacunas conhecidas

| Necessidade | Lacuna atual |
|---|---|
| Pipeline CRM | `Opportunity` existe no Prisma, mas não possui API |
| Vendas por vendedor | `Quote` e `SalesOrder` não têm `sellerId` |
| Minhas tarefas | Não há model de tarefa/atividade CRM |
| Margem por pedido | Não há snapshot consolidado de custo na venda |
| Saldo bancário real | Não há model de conta bancária/saldo inicial |
| Movimentação por produto | `StockMovement` não possui `productId` |

## 7. Referências

- Legado: `_legacy/src/pages/DashboardPage.tsx` e `_legacy/src/components/DashboardCharts.tsx`
- Documentação: `docs/docs_legancy/01_project_overview.md` e `docs/docs_legancy/Wireframes Textuais das Principais Telas.md`
- Dados: `packages/database/prisma/schema.prisma`
- Tipografia e superfícies: `docs/07-design-tokens-typography.md`
