# Design Tokens — Tipografia, Raio e Superfícies (DJOB System)

**Data:** 15 de Julho de 2026
**Status:** VIGENTE
**Projeto:** D.job System (ERP/CRM Híbrido)
**Relacionado:** [ADR #002](./05-adr-002-typography-roboto.md) (fonte revertida para `Inter`), [ADR #003](./06-adr-003-brand-colors.md) (paleta de cores).

> Fonte da verdade para **tamanhos/pesos de fonte, raio de borda e superfícies de card**. Toda tela nova ou refatorada DEVE seguir esta escala. Qualquer divergência deve ser corrigida.

## 1. Fonte

- **Família única:** `Inter` (via `next/font/google` no `layout.tsx`). `Tailwind fontFamily.sans` e `fontFamily.mono` apontam para `Inter`.
- **Regra de ouro:** **uma só família em toda a plataforma.** A hierarquia é expressa **apenas por tamanho e peso** — nunca por famílias diferentes.
- **Números:** usar `tabular-nums` (nunca `font-mono`) para alinhamento de colunas mantendo a mesma fonte.

## 2. Escala Tipográfica

| Uso                                                   | Classe Tailwind                                                     | Tamanho | Peso    |
| ----------------------------------------------------- | ------------------------------------------------------------------- | ------- | ------- |
| **Valor de KPI / métrica**                            | `text-2xl font-bold tabular-nums`                                   | 24px    | 700     |
| **Título de página** (`PageActionHeader`)             | `text-sm font-semibold tracking-tight`                              | 14px    | 600     |
| **Título de seção / card**                            | `text-base font-semibold`                                           | 16px    | 600     |
| **Título de modal / dialog**                          | `text-base font-semibold`                                           | 16px    | 600     |
| **Rótulo de KPI** (label do card de métrica)          | `text-xs font-medium uppercase tracking-wide text-muted-foreground` | 12px    | 500     |
| **Cabeçalho de tabela** (`TableHead`)                 | `text-xs font-medium uppercase tracking-wide text-muted-foreground` | 12px    | 500     |
| **Corpo / célula de tabela**                          | `text-sm`                                                           | 14px    | 400     |
| **Descrição / subtítulo de card** (`CardDescription`) | `text-sm text-muted-foreground`                                     | 14px    | 400     |
| **Empty state / loading / mensagem secundária**       | `text-sm text-muted-foreground`                                     | 14px    | 400     |
| **Meta / legenda pequena**                            | `text-xs text-muted-foreground`                                     | 12px    | 400/500 |
| **Badge / pill de status**                            | `text-xs font-medium`                                               | 12px    | 500     |

### Regras de peso

- **Proibido `font-extrabold`** (peso 800). O peso máximo é `font-bold` (700), reservado a valores de KPI.
- Ênfase de títulos: `font-semibold` (600). Corpo: `font-normal` (400). Rótulos/labels: `font-medium` (500).
- Não misturar `tracking-wider` e `tracking-wide` para o mesmo tipo de elemento — o padrão de cabeçalhos/labels em caixa alta é `tracking-wide`.

## 3. Raio de Borda

- **Cards e botões e inputs:** `rounded-lg` (= `var(--radius)` = 0.625rem / 10px). **Não usar `rounded-md`** em cards/controles.
- **Pills de status:** `rounded-full`.
- **Ícone de identidade do `PageActionHeader`:** `rounded-full` (círculo perfeito, `h-9 w-9`).

## 4. Superfícies de Card

- **Todo card usa `bg-card`** (branco no tema claro, superfície escura no tema escuro) — nunca `bg-muted`, `bg-primary` preenchido ou cores de status como fundo de card.
- **Proibido `border-dashed`** em cards. Empty states são cards sólidos (`border border-border rounded-lg bg-card`).
- Borda: `border-border`. Sombra: `shadow-sm` (a `shadow-lg` fica reservada a modais/overlays).
- `PageActionHeader`: **sem** `border-b` — a separação é feita pelo card interno (`bg-card/50` + `border border-border`).

## 5. Cores de acento (resumo — ver ADR #003)

- **Primary (teal `#548f98`):** ações, ícones, navegação ativa, monograma e wordmark.
- **Secondary (coral `#ec5466`):** acento de identidade pontual (ex.: ponto de notificação). Não usar como cor de status.
- **Status:** `success` (verde), `warning` (âmbar), `destructive` (vermelho), `info` (azul) — via tokens semânticos, nunca hex hardcoded.
