# Design: Páginas Legais (Termos de Uso & Política de Privacidade)

**Data:** 2026-07-15
**Status:** Aprovado — pronto para implementação

---

## 1. Resumo do Entendimento

- **O que:** Duas páginas públicas de conteúdo legal — Termos de Uso (`/termos-de-uso`) e Política de Privacidade (`/politica-de-privacidade`)
- **Por que:** Obrigação legal e os links já existem como placeholders na tela de login
- **Para quem:** Usuários do D.job System (operadores de ERP B2B) e visitantes pré-autenticação
- **Layout:** Página limpa centrada, header com logo D.job, conteúdo em prosa (~800px max), footer com copyright
- **Funcionalidades:** Índice automático (ToC) navegável, toggle de tema claro/escuro, botão voltar
- **Conteúdo:** Template genérico profissional para SaaS B2B, customizável posteriormente
- **Não-objetivos:** Não é CMS, não é editável por não-devs, não requer autenticação

## 2. Premissas

1. O texto legal é genérico e não foi revisado por advogado (template)
2. Os links na página de login (`<span>`) serão convertidos em `<Link>` apontando para as novas rotas
3. As páginas compartilham um layout comum (`LegalShell`)
4. O toggle de tema reutiliza o padrão já existente no `AuthShell`
5. O nome da empresa nos textos será "D.job Sistemas"

## 3. Estrutura de Arquivos

```
apps/web/src/
├── app/
│   ├── (legal)/
│   │   ├── layout.tsx                    ← Metadata + wrapper mínimo
│   │   ├── termos-de-uso/
│   │   │   └── page.tsx                  ← Server Component com conteúdo
│   │   └── politica-de-privacidade/
│   │       └── page.tsx                  ← Server Component com conteúdo
├── components/
│   └── legal/
│       └── LegalShell.tsx                ← Client Component (tema + ToC)
```

- `(legal)` é route group — não aparece na URL
- As `page.tsx` são Server Components (SEO-friendly)
- O `LegalShell` é `'use client'` (toggle de tema + ToC interativo)

## 4. Componente LegalShell

### Props

```typescript
interface LegalShellProps {
  title: string;
  lastUpdated: string;
  sections: { id: string; title: string }[];
  children: ReactNode;
}
```

### Wireframe

```
┌──────────────────────────────────────────────────────────┐
│  [D] D.job System                      [☀/🌙] [← Voltar] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌───────────────────────────────────┐    │
│  │  Índice   │  │  Título (h1)                      │    │
│  │           │  │  "Última atualização: Jul 2026"    │    │
│  │  1. Seção │  │                                   │    │
│  │  2. Seção │  │  Seção 1 (h2)                     │    │
│  │  3. Seção │  │  Parágrafo...                     │    │
│  │  ...      │  │  ...                              │    │
│  └──────────┘  └───────────────────────────────────┘    │
│   (sticky)      (max-w-3xl, prose)                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  © 2026 D.job Sistemas — Todos os direitos reservados    │
└──────────────────────────────────────────────────────────┘
```

### Comportamento

- **Desktop (lg+):** ToC sticky à esquerda (~200px), conteúdo à direita
- **Mobile (<lg):** ToC colapsado no topo (disclosure), conteúdo full-width
- **ToC:** Links âncora com scroll suave
- **Header:** Logo D.job, toggle de tema, botão "Voltar" (router.back() ou /auth/login)
- **Footer:** Copyright consistente com o AuthShell

## 5. Conteúdo dos Templates

### Termos de Uso (~8 seções)

1. Aceitação dos Termos
2. Descrição do Serviço
3. Cadastro e Conta
4. Uso Permitido
5. Propriedade Intelectual
6. Limitação de Responsabilidade
7. Modificações dos Termos
8. Foro e Legislação Aplicável

### Política de Privacidade (~8 seções)

1. Dados Coletados
2. Finalidade do Tratamento
3. Base Legal (LGPD)
4. Compartilhamento de Dados
5. Armazenamento e Segurança
6. Direitos do Titular
7. Cookies e Tecnologias
8. Contato e Encarregado (DPO)

## 6. Integração

- Converter `<span>` na página de login (linhas 215-219) em `<Link>` com `target="_blank"`
- As rotas são públicas, sem necessidade de autenticação

## 7. Requisitos Não Funcionais

- **Performance:** Server Components estáticos, renderizados em build-time
- **SEO:** Metadata adequada (title, description) por página, HTML semântico
- **Acessibilidade:** Headings hierárquicos, navegação por teclado no ToC, contraste via design system
- **Manutenção:** Texto no TSX, editável por qualquer dev

## 8. Decision Log

| # | Decisão | Alternativas | Justificativa |
|---|---------|-------------|---------------|
| 1 | Conteúdo estático no TSX | Markdown, API/CMS | Simplicidade, sem deps extras, 2 páginas |
| 2 | Rotas raiz (`/termos-de-uso`) | `/auth/*`, `/legal/*` | URLs limpas, públicas, SEO-friendly |
| 3 | Layout centrado com prosa | AuthShell, sidebar nav | Padrão de mercado para conteúdo legal |
| 4 | ToC + tema + voltar | Mínimo | UX para textos longos, tema consistente |
| 5 | LegalShell compartilhado | Independentes, MDX | Reutilização, extensibilidade, padrão do projeto |
| 6 | Server Components + client shell | Tudo client | SEO em server, interatividade mínima no client |
| 7 | Template genérico SaaS B2B | Placeholder | Entrega funcional imediata, customizável |
