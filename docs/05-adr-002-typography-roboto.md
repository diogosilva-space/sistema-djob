# ADR #002: Tipografia — Migração de `Inter` para `Roboto`

**Data:** 14 de Julho de 2026
**Status:** ❌ REVERTIDO em 14 de Julho de 2026 — a fonte oficial voltou a ser `Inter`.
**Projeto:** D.job System (ERP/CRM Híbrido)
**Supersede:** Decisão de tipografia da [ADR #001](./02-architecture-adr.md) (seção 2.1) e do Design System (`docs/docs_legancy/02_design_system.md`, seção 4.2), exclusivamente no que se refere à `font-family`.

> [!IMPORTANT]
> **REVERSÃO (14/07/2026):** Após avaliação visual, a migração para `Roboto` foi revertida. A `font-family` oficial e exclusiva do D.job System voltou a ser **`Inter`** (carregada via `next/font/google` no root layout; `Tailwind fontFamily.sans` e `fontFamily.mono` apontam para `Inter`, garantindo uma **única família** em toda a plataforma — a hierarquia é expressa apenas por **peso** (300–700), nunca por famílias diferentes). O `tracking-[0.02em]` específico do Roboto foi removido. Este documento é mantido apenas como registro histórico da decisão e de sua reversão (conforme a Seção 4 — Reversibilidade). A decisão de tipografia da ADR #001 (`Inter`) volta a vigorar.

## 1. Contexto e Problema

A ADR #001 (APROVADA) e o Design System definiram `Inter` como a `font-family` exclusiva do sistema. Durante a **Reforma Global de UI/UX (Minimalismo Flat DJOB / Cockpit)**, optou-se por revisar a identidade tipográfica do produto.

A decisão de migrar para `Roboto` é uma escolha de identidade visual conduzida pelo time do produto. Como `Inter` era uma decisão arquitetural aprovada e tratada como fonte da verdade, a alteração **não pode** ser feita apenas no código: exige uma ADR que a formalize, preserve o histórico e mantenha a rastreabilidade.

## 2. Decisão Arquitetural

- **Nova `font-family` exclusiva:** `Roboto` (disponível no Google Fonts).
- **Carregamento:** via `next/font/google` em `apps/web/src/app/layout.tsx`, com `subsets: ['latin']` e pesos `400` (Regular), `500` (Medium), `700` (Bold), cobrindo a escala tipográfica do Design System (h1 Bold, h2 SemiBold/Medium, body/label Regular).
- **Escopo:** substituição total de `Inter` em toda a aplicação `apps/web`. Nenhum componente deve referenciar `Inter` após a migração.
- **Demais decisões da ADR #001 permanecem inalteradas** (Next.js App Router, Shadcn/ui estilo minimalista, flat sem glassmorphism/animações excessivas, Tailwind, etc.).
- **Refinamento tipográfico:** `tracking-[0.02em]` (letter-spacing) aplicado ao body para melhor legibilidade em interfaces densas. `font-smoothing: antialiased`. Ícones com `strokeWidth: 1.5` para harmonia visual.

## 3. Consequências e Restrições

- **Positivas:** identidade tipográfica alinhada à direção atual do produto; `Roboto` é altamente legível para interfaces densas (Cockpit) e amplamente suportada.
- **Custos:** atualização do `layout.tsx` e verificação de que nenhuma classe/estilo fixe `Inter`.
- **Conformidade documental:** este documento passa a ser a fonte da verdade para tipografia. O Design System (`02_design_system.md`, 4.2) e a ADR #001 (2.1) devem ser lidos em conjunto com esta ADR, que os supersede **apenas quanto à fonte**.
- **Alinhamento com regras do agente:** a regra B de `.agents/AGENTS.md` (que citava Inter) fica subordinada a esta ADR quanto à fonte.

## 4. Reversibilidade (Plano de Rollback para `Inter`)

Esta decisão é **explicitamente reversível**. Se a avaliação visual posterior indicar retorno a `Inter`:

1. Reverter a importação em `apps/web/src/app/layout.tsx` (`Roboto` → `Inter`), mantendo `subsets`/pesos equivalentes.
2. Rodar a varredura de conformidade garantindo que nenhuma referência a `Roboto` permaneça.
3. Atualizar o **Status** desta ADR para `SUPERSEDED` e registrar uma ADR #003 documentando o retorno, ou reverter o Status para refletir a decisão vigente.
4. Como a fonte é carregada num único ponto (`next/font/google` no root layout) e a tipografia é controlada por tokens/escala, o rollback é de **baixo risco e baixo custo** (alteração pontual, sem migração de dados).

## 5. Impacto no Plano de Reforma (v2)

- O item de tipografia do Plano de Reforma Global (v2) passa de "manter Inter" para **"aplicar Roboto"**, agora respaldado por esta ADR (deixa de ser um conflito com a fonte da verdade).
- Nenhum outro item do plano é afetado (correção de shades inválidos, token de raio 8px, contraste do primário verde, paleta de status única permanecem).
