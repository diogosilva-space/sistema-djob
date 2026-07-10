# Design System e Identidade Visual

O design system será construído com base na identidade visual existente da DJOB, garantindo consistência e reconhecimento da marca em toda a aplicação. A UI será moderna, limpa e focada na usabilidade para tarefas complexas de um ERP.

### 4.1. Paleta de Cores

A paleta será derivada do logo e do site da DJOB, com ajustes para garantir acessibilidade e uma hierarquia visual clara para uma aplicação de software.

- **Primária (Ações Principais):** `#8BC34A` (Verde DJOB)
- **Secundária (Destaques):** `#FF4081` (Rosa/Vermelho para alertas ou destaques especiais)
- **Fundo (Background):** `#F8FAFC` (Cinza muito claro, para conforto visual)
- **Cards e Superfícies:** `#FFFFFF` (Branco)
- **Texto Principal:** `#1E293B` (Cinza escuro, quase preto)
- **Texto Secundário:** `#64748B` (Cinza médio)
- **Bordas e Divisórias:** `#E2E8F0` (Cinza claro)

### 4.2. Tipografia

Será utilizada uma fonte sans-serif moderna e de alta legibilidade, adequada para interfaces de sistemas.

- **Fonte Principal:** Inter (disponível gratuitamente no Google Fonts)
- **Tamanhos e Pesos:**
    - Títulos de Página (h1): 24px, Bold
    - Títulos de Seção (h2): 20px, SemiBold
    - Labels e Texto Normal: 14px, Regular
    - Texto Pequeno/Helper: 12px, Regular

### 4.3. Componentes Base (Exemplos com Shadcn/ui)

**Botão (Button):**

- **Primário:** Fundo verde DJOB (`#8BC34A`), texto branco. Usado para ações principais (ex: "Salvar", "Criar Pedido").
- **Secundário:** Fundo branco, borda e texto verde DJOB. Usado para ações secundárias (ex: "Cancelar", "Exportar").
- **Destrutivo:** Fundo vermelho, texto branco. Usado para ações perigosas (ex: "Excluir
  Cliente").

**Input de Formulário (Input):**

- Bordas cinza claro (`#E2E8F0`), com um anel de foco sutil na cor verde DJOB (`#8BC34A`) para indicar interatividade e acessibilidade.

**Card:**

- Fundo branco (`#FFFFFF`), com uma sombra (`box-shadow`) sutil para criar profundidade e separar os blocos de conteúdo. Bordas arredondadas (8px) para um visual moderno e amigável.
