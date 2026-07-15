# Análise do Código Legado (Fase 0)

Esta auditoria identificou os modelos de dados e regras de negócio presentes no código legado (SPA Vite na pasta `_legacy/`) que não haviam sido cobertos integralmente na primeira versão do nosso `schema.prisma`.

## 1. Módulo CRM (Oportunidades e Pipeline)

No sistema legado, o CRM vai muito além do cadastro de Clientes (`Customer`) e Fornecedores (`Supplier`). Ele conta com um funil de vendas completo.

**Entidades faltando:**

- `Opportunity` (Oportunidade/Deal)
  - **Status Kanban:** `lead_qualificado`, `contato_inicial`, `apresentacao`, `proposta_enviada`, `negociacao`, `fechado_ganho`, `fechado_perdido`.
  - **Campos:** `valor`, `probabilidade (0-100)`, `vendedorId`, `dataUltimaInteracao`, `dataFechamento`, `tags`.

**Ação:** Adicionar o model `Opportunity` associado ao `Customer` e ao `User` (Vendedor) no Prisma.

## 2. Módulo Produção / PCP (Apontamentos)

A modelagem atual possui a `ProductionOrder` (Ordem) e `ProductionStep` (Etapa), mas no legado há uma necessidade rigorosa de apontamento de tempo e defeitos no chão de fábrica.

**Entidades faltando:**

- `ProductionLog` (Apontamento)
  - **Campos:** `etapaId` (relacionado a ProductionStep), `tipo` ('Início' ou 'Fim'), `quantidadeProcessada`, `quantidadeDefeito`, `tipoDefeito`, `responsavelNome` (ou userId).
  - _Contexto:_ Em confecção de roupas, o rastreio de perda (quantidadeDefeito) por etapa é essencial para cálculo de OEE (Overall Equipment Effectiveness) e custo real.

**Ação:** Adicionar o model `ProductionLog` atrelado ao `ProductionStep`.

## 3. Módulo Produtos (Ficha Técnica / BOM)

Nosso schema já prevê um campo JSON genérico (`bomTemplate`), mas o legado estrutura isso de forma mais estrita e prevê controle de matéria prima.

**Campos adicionais identificados:**

- Matérias-Primas (`RawMaterial` ou `BomItem` explícito ao invés de JSON).
- Atributos padronizados de grade (tamanhosDisponiveis, coresDisponiveis).
- Tempos de produção (tempoProducaoPadrao).

**Ação:** Expandir os campos do `Product` no Prisma para contemplar a gestão da Ficha Técnica de Confecção (tempos e custos de insumos).

---

_Status: Pendente atualização do `schema.prisma` com os resultados desta auditoria._
