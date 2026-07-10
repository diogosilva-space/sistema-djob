# Wireframes Textuais das Principais Telas

## Sistema ERP/CRM DJOB

Este documento apresenta wireframes em formato textual (ASCII) para as principais telas do sistema, servindo como guia visual para a implementação do frontend.

---

## 1. Layout Geral do Sistema

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [LOGO DJOB]        🔍 Buscar...                    🔔  👤 João Silva  ▼     │
├────────────────┬─────────────────────────────────────────────────────────────┤
│                │                                                             │
│  📊 Dashboard  │                                                             │
│                │                                                             │
│  👥 CRM        │                                                             │
│    ├ Clientes  │                    ÁREA DE CONTEÚDO                         │
│    ├ Pipeline  │                                                             │
│    └ Atividades│                    (Varia conforme o módulo selecionado)    │
│                │                                                             │
│  💰 Vendas     │                                                             │
│    ├ Orçamentos│                                                             │
│    └ Pedidos   │                                                             │
│                │                                                             │
│  📦 Produtos   │                                                             │
│                │                                                             │
│  🏭 Produção   │                                                             │
│                │                                                             │
│  📋 Estoque    │                                                             │
│                │                                                             │
│  🛒 Compras    │                                                             │
│                │                                                             │
│  💵 Financeiro │                                                             │
│                │                                                             │
│  ⚙️ Config.    │                                                             │
│                │                                                             │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 2. Dashboard Principal

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Dashboard                                                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌──────────┐│
│  │ 💰 Faturamento  │  │ 👥 Novos        │  │ 📦 Pedidos      │  │ 🏭 OPs   ││
│  │    do Mês       │  │    Clientes     │  │    em Aberto    │  │   Ativas ││
│  │                 │  │                 │  │                 │  │          ││
│  │  R$ 125.430,00  │  │       12        │  │       28        │  │    5     ││
│  │  ▲ +15% vs mês  │  │  ▲ +3 vs mês   │  │                 │  │          ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └──────────┘│
│                                                                              │
│  ┌────────────────────────────────────┐  ┌─────────────────────────────────┐│
│  │  📈 Evolução do Faturamento       │  │  🥧 Vendas por Categoria        ││
│  │                                    │  │                                 ││
│  │      ╭──────────────────╮          │  │         ┌───────┐              ││
│  │  R$  │                  │          │  │        /  Brindes \             ││
│  │      │    ╱╲    ╱╲      │          │  │       │    58%     │            ││
│  │      │   ╱  ╲  ╱  ╲     │          │  │        \  ─────── /             ││
│  │      │  ╱    ╲╱    ╲    │          │  │         │Confecção│             ││
│  │      ╰──────────────────╯          │  │         │   42%   │             ││
│  │       Jan  Fev  Mar  Abr  Mai  Jun │  │         └─────────┘             ││
│  └────────────────────────────────────┘  └─────────────────────────────────┘│
│                                                                              │
│  ┌────────────────────────────────────┐  ┌─────────────────────────────────┐│
│  │  ✅ Minhas Tarefas Hoje           │  │  ⚠️ Alertas do Sistema          ││
│  │                                    │  │                                 ││
│  │  ☐ Follow-up com Cliente ABC      │  │  🔴 Estoque Baixo: Caneca Branca││
│  │  ☐ Enviar orçamento para XYZ      │  │  🟡 Pedido #1234 atrasado       ││
│  │  ☑ Confirmar entrega Pedido #456  │  │  🟢 OP #789 finalizada          ││
│  │  ☐ Reunião com fornecedor 15h     │  │                                 ││
│  └────────────────────────────────────┘  └─────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CRM - Pipeline de Vendas (Kanban)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Pipeline de Vendas                          [Filtros ▼]  [+ Nova Oportunidade]│
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Lead Qualificado   Contato Inicial   Proposta Enviada    Negociação        │
│  R$ 45.000 (5)      R$ 32.000 (3)     R$ 78.000 (4)       R$ 25.000 (2)     │
│  ─────────────────  ─────────────────  ─────────────────  ─────────────────  │
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │ Empresa ABC   │  │ Escola XYZ    │  │ Evento Corp.  │  │ Loja 123      │ │
│  │ R$ 15.000     │  │ R$ 12.000     │  │ R$ 35.000     │  │ R$ 18.000     │ │
│  │ 🟢 70%        │  │ 🟡 50%        │  │ 🟢 80%        │  │ 🟡 60%        │ │
│  │ há 2 dias     │  │ há 1 dia      │  │ há 3 dias     │  │ há 5 dias     │ │
│  │ 👤 Maria      │  │ 👤 João       │  │ 👤 Maria      │  │ 👤 Pedro      │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘ │
│                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│  │ Indústria DEF │  │ ONG Solidária │  │ Prefeitura    │  │ Hospital Vida │ │
│  │ R$ 8.000      │  │ R$ 5.000      │  │ R$ 28.000     │  │ R$ 7.000      │ │
│  │ 🟡 40%        │  │ 🟢 65%        │  │ 🟡 55%        │  │ 🟢 75%        │ │
│  │ há 4 dias     │  │ há 1 dia      │  │ há 2 dias     │  │ há 1 dia      │ │
│  │ 👤 Pedro      │  │ 👤 Ana        │  │ 👤 João       │  │ 👤 Ana        │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘ │
│                                                                              │
│  ┌───────────────┐                     ┌───────────────┐                     │
│  │ Startup Tech  │                     │ Clube Esporte │                     │
│  │ R$ 22.000     │                     │ R$ 15.000     │                     │
│  │ 🔴 25%        │                     │ 🟡 45%        │                     │
│  │ há 7 dias     │                     │ há 4 dias     │                     │
│  │ 👤 Maria      │                     │ 👤 Pedro      │                     │
│  └───────────────┘                     └───────────────┘                     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Vendas - Criação de Orçamento

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Novo Orçamento                                     [Cancelar]  [💾 Salvar]  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Informações do Orçamento ──────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  Nº Orçamento: ORC-2026-00456        Data: 27/01/2026                   ││
│  │                                                                          ││
│  │  Cliente: [🔍 Buscar cliente...                              ▼]         ││
│  │                                                                          ││
│  │  Validade: [30 dias ▼]    Vendedor: [João Silva ▼]                      ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Itens do Orçamento ────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  [+ Adicionar Produto]                                                   ││
│  │                                                                          ││
│  │  ┌────────┬────────────────────┬─────┬────────┬─────┬─────────┬───────┐ ││
│  │  │ SKU    │ Produto            │ Qtd │ Preço  │ Desc│ Subtotal│ Ações │ ││
│  │  ├────────┼────────────────────┼─────┼────────┼─────┼─────────┼───────┤ ││
│  │  │CAN-001 │ Caneca Branca 300ml│ 100 │ R$12,00│  5% │R$1.140  │🎨 🗑️ │ ││
│  │  │        │ + Sublimação       │     │ R$ 5,00│     │R$  500  │       │ ││
│  │  ├────────┼────────────────────┼─────┼────────┼─────┼─────────┼───────┤ ││
│  │  │CAM-002 │ Camiseta Polo M    │  50 │ R$45,00│ 10% │R$2.025  │🎨 🗑️ │ ││
│  │  │        │ + Bordado (logo)   │     │ R$ 8,00│     │R$  400  │       │ ││
│  │  └────────┴────────────────────┴─────┴────────┴─────┴─────────┴───────┘ ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Resumo Financeiro ─────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  Subtotal Produtos:           R$  3.165,00                              ││
│  │  Custo de Personalização:     R$    900,00                              ││
│  │  Frete Estimado:              R$    150,00                              ││
│  │  Desconto Global: [  5  ]%    R$   -210,75                              ││
│  │  ─────────────────────────────────────────                              ││
│  │  TOTAL:                       R$  4.004,25                              ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Produção - Ordem de Produção

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Ordem de Produção: OP-2026-00089                            [📄 Imprimir]  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Informações da OP ─────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  Status: [🟡 Em Produção]    Prioridade: [🔴 Alta]                      ││
│  │                                                                          ││
│  │  Pedido Vinculado: PED-2026-00234    Cliente: Empresa ABC Ltda          ││
│  │                                                                          ││
│  │  Produto: Camiseta Polo Branca       Quantidade: 200 unidades           ││
│  │                                                                          ││
│  │  Data de Emissão: 20/01/2026         Entrega Prometida: 30/01/2026      ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Etapas de Produção ────────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  ✅ CORTE                                                                ││
│  │  │   Início: 21/01 08:00   Fim: 21/01 12:00   Responsável: Carlos       ││
│  │  │   Quantidade: 200/200   Status: Concluído                            ││
│  │  │                                                                       ││
│  │  ✅ COSTURA                                                              ││
│  │  │   Início: 21/01 14:00   Fim: 23/01 18:00   Responsável: Ana          ││
│  │  │   Quantidade: 200/200   Status: Concluído                            ││
│  │  │                                                                       ││
│  │  🔄 ESTAMPARIA                                                           ││
│  │  │   Início: 24/01 08:00   Fim: --            Responsável: Pedro        ││
│  │  │   Quantidade: 150/200   Status: Em Andamento                         ││
│  │  │   [Registrar Apontamento]                                            ││
│  │  │                                                                       ││
│  │  ⏳ ACABAMENTO                                                           ││
│  │  │   Início: --            Fim: --            Responsável: --           ││
│  │  │   Quantidade: 0/200     Status: Pendente                             ││
│  │  │                                                                       ││
│  │  ⏳ CONTROLE DE QUALIDADE                                                ││
│  │      Início: --            Fim: --            Responsável: --           ││
│  │      Quantidade: 0/200     Status: Pendente                             ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Materiais Consumidos ──────────────────────────────────────────────────┐│
│  │                                                                          ││
│  │  Material              │ Previsto  │ Consumido │ Saldo                   ││
│  │  ─────────────────────────────────────────────────────────              ││
│  │  Tecido Piquet Branco  │ 160m      │ 158m      │ +2m                     ││
│  │  Linha Branca          │ 2kg       │ 1.8kg     │ +0.2kg                  ││
│  │  Botões Brancos        │ 600un     │ 600un     │ 0                       ││
│  │                                                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Responsividade - Versão Mobile

```
┌────────────────────────┐
│ ☰  DJOB    🔔  👤      │
├────────────────────────┤
│                        │
│  Dashboard             │
│                        │
│  ┌──────────────────┐  │
│  │ 💰 Faturamento   │  │
│  │   R$ 125.430,00  │  │
│  │   ▲ +15%         │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ 📦 Pedidos       │  │
│  │      28          │  │
│  │   em aberto      │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ 📈 Vendas Mês    │  │
│  │                  │  │
│  │   [Gráfico]      │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
│  ┌──────────────────┐  │
│  │ ✅ Tarefas Hoje  │  │
│  │                  │  │
│  │ ☐ Follow-up ABC  │  │
│  │ ☐ Orçamento XYZ  │  │
│  │ ☑ Entrega #456   │  │
│  │                  │  │
│  └──────────────────┘  │
│                        │
└────────────────────────┘

Menu Mobile (ao clicar ☰):
┌────────────────────────┐
│ ✕  Menu                │
├────────────────────────┤
│  📊 Dashboard          │
│  👥 CRM                │
│  💰 Vendas             │
│  📦 Produtos           │
│  🏭 Produção           │
│  📋 Estoque            │
│  🛒 Compras            │
│  💵 Financeiro         │
│  ⚙️ Configurações      │
│                        │
│  ─────────────────     │
│  👤 João Silva         │
│  🚪 Sair               │
└────────────────────────┘
```

---

Este documento de wireframes textuais serve como referência visual para a equipe de desenvolvimento, complementando as especificações detalhadas de campos e componentes.
