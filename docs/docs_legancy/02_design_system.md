# Design System e Identidade Visual

O design system será construído com base na identidade visual existente da DJOB, garantindo consistência e reconhecimento da marca em toda a aplicação. A UI será moderna, limpa e focada na usabilidade para tarefas complexas de um ERP.

### 4.1. Paleta de Cores

> **[SUPERSEDED: a paleta de cores da marca foi atualizada para a identidade DJOB 2026. Ver `docs/06-adr-003-brand-colors.md`. Os valores abaixo são mantidos apenas como registro histórico.]**

A paleta é derivada da identidade visual atual da DJOB (`djob.com.br/sobre`), com ajustes para garantir acessibilidade e uma hierarquia visual clara para uma aplicação de software. Suporta temas claro e escuro via tokens semânticos (`next-themes`).

- **Primária (Ações Principais):** `#548f98` (Teal DJOB) — token `primary`
- **Primária Clara (Hover/variação):** `#6dadb7` (Teal claro) — usada no `primary` do tema escuro
- **Secundária (Destaques/Alertas):** `#ec5466` (Coral) — token `secondary`
- **Fundo (Background):** `#f4f5f7` (Cinza muito claro, para conforto visual)
- **Cards e Superfícies:** `#FFFFFF` (Branco)
- **Texto Principal:** token `foreground` (adapta-se ao tema)
- **Texto Secundário:** token `muted-foreground`
- **Bordas e Divisórias:** token `border`

Histórico (paleta anterior, descontinuada): Primária `#8BC34A` (Verde), Secundária `#FF4081` (Rosa).

### 4.2. Tipografia

Será utilizada uma fonte sans-serif moderna e de alta legibilidade, adequada para interfaces de sistemas.

- **Fonte Principal:** Inter (disponível gratuitamente no Google Fonts) — **[SUPERSEDED: a fonte principal foi migrada para `Roboto`. Ver `docs/05-adr-002-typography-roboto.md`.]**
- **Tamanhos e Pesos:**
  - Títulos de Página (h1): 24px, Bold
  - Títulos de Seção (h2): 20px, SemiBold
  - Labels e Texto Normal: 14px, Regular
  - Texto Pequeno/Helper: 12px, Regular

### 4.3. Componentes Base (Exemplos com Shadcn/ui)

**Botão (Button):**

- **Primário:** Fundo teal DJOB (token `primary`, `#548f98`), texto `primary-foreground`. Usado para ações principais (ex: "Salvar", "Criar Pedido").
- **Secundário/Outline:** Fundo transparente, borda e texto em tokens neutros. Usado para ações secundárias (ex: "Cancelar", "Exportar").
- **Destrutivo:** Token `destructive`, texto branco. Usado para ações perigosas (ex: "Excluir Cliente").

**Input de Formulário (Input):**

- Bordas em token `input`, com anel de foco sutil no token `ring` (teal DJOB) para indicar interatividade e acessibilidade.

**Card:**

- Fundo em token `card` (adapta-se ao tema), com uma sombra (`box-shadow`) sutil para criar profundidade e separar os blocos de conteúdo. Bordas arredondadas (`--radius`, 0.625rem) para um visual moderno e amigável.
- Cards de destaque (ex: "Faturamento", "Saldo Projetado") usam `bg-primary text-primary-foreground` — nunca `bg-slate-900` fixo, garantindo consistência entre temas claro/escuro.
