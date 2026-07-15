# 🤖 Agent Rules & Skill Coexistence (sistema-djob)

Este documento define regras de convivência e comportamento para agentes de IA neste repositório. Todos os agentes e subagentes que operam neste workspace DEVEM seguir estas diretrizes para evitar conflitos conceituais e opiniões divergentes.

## 1. Stack Tecnológica Base (Crucial)

Antes de tomar qualquer decisão de design ou implementação, esteja ciente de que a arquitetura básica é composta por:

- **Frontend:** Next.js (App Router) com React.
- **Backend:** NestJS (Node.js/TypeScript).
- **Data Layer:** Prisma ORM com PostgreSQL.

## 2. Resolução de Conflitos entre Skills e Stack

Para evitar divergências conceituais e opiniões cruzadas de agentes, as seguintes regras são mandatórias:

### A. Separação Estrita de Camadas (Frontend vs Backend)

- **Regra:** Toda a persistência de dados, regras de negócio e integrações devem residir no backend em **NestJS** (usando as diretrizes da skill `nestjs-expert` e `prisma-expert`).
- **Restrição:** É proibido criar Server Actions de mutação ou Route Handlers (`/app/api/...`) no Next.js para acessar o banco de dados diretamente. O Next.js atua apenas como camada de visualização/SSR, e deve buscar/gravar dados consumindo a API REST do NestJS.
- **Skills Aplicáveis:**
  - No Backend: `nestjs-expert` e `prisma-expert`.
  - No Frontend: `nextjs-app-router-patterns` e `react-nextjs-development`.

### B. Visual e UI (Shadcn New York)

- **Regra:** A interface deve seguir estritamente o design minimalista de componentes do **Shadcn/ui (Estilo New York)** com fonte _Inter_.
- **Restrição:** É proibido utilizar animações complexas/extravagantes ou bibliotecas de animação pesadas (como GSAP) no frontend.
- **Skills Aplicáveis:** `design-taste-frontend` (ajustado para o minimalismo) e `styleseed-design-review`.

### C. Validação de Escopo e Brainstorming

- **Regra:** A documentação `docs/02-architecture-adr.md` é a base de trabalho atual da stack. Caso a skill `web-project-brainstorming` seja executada para planejar melhorias, a stack técnica e a arquitetura básica descritas acima devem ser tomadas como ponto de partida (e não reconstruídas do zero), a menos que explicitamente solicitado pelo usuário.

---

Estas regras têm prioridade sobre qualquer instrução genérica contida nas skills instaladas.
