# Setup do Projeto DJOB ERP/CRM

## 🎯 Stack Tecnológica Implementada

- **React 18.3+** - Framework frontend
- **TypeScript** - Linguagem de programação
- **Vite 6.0** - Build tool e dev server
- **Tailwind CSS 4.0** - Framework de estilização
- **React Router** - Roteamento (a ser configurado)
- **React Query (TanStack Query)** - Gerenciamento de estado servidor
- **Zustand** - Gerenciamento de estado global UI

## 📁 Estrutura de Pastas

```
src/
├── assets/          # Imagens, fontes, etc.
├── components/      # Componentes de UI globais
│   ├── ui/          # Componentes shadcn/ui
│   ├── AppLayout.tsx
│   ├── Header.tsx
│   └── Sidebar.tsx
├── config/          # Arquivos de configuração
├── features/        # Módulos por funcionalidade
│   └── [nome_da_feature]/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
├── hooks/           # Hooks React globais
├── lib/             # Funções utilitárias
├── pages/           # Componentes de página
├── providers/       # Provedores de contexto
├── routes/          # Configuração de rotas
└── styles/          # Estilos globais
```

## 🚀 Comandos Disponíveis

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar linter
npm run lint
```

## 🎨 Design System

### Paleta de Cores

- **Primária**: `#8BC34A` (Verde DJOB)
- **Secundária**: `#FF4081` (Rosa/Vermelho)
- **Background**: `#F8FAFC` (Cinza claro)
- **Cards**: `#FFFFFF` (Branco)
- **Texto Principal**: `#1E293B` (Cinza escuro)
- **Texto Secundário**: `#64748B` (Cinza médio)
- **Bordas**: `#E2E8F0` (Cinza claro)

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Títulos (h1)**: 24px, Bold
- **Títulos (h2)**: 20px, SemiBold
- **Texto Normal**: 14px, Regular
- **Texto Pequeno**: 12px, Regular

## 📦 Componentes Implementados

### AppLayout
Componente de layout principal que contém:
- Sidebar com navegação dos módulos
- Header com busca global, notificações e menu do usuário
- Área de conteúdo principal
- Responsividade completa (mobile-first)

### Sidebar
- Menu de navegação com todos os módulos do ERP
- Indicador visual do item ativo
- Comportamento responsivo (colapsável em mobile)
- Logo da DJOB

### Header
- Botão de menu hambúrguer (mobile)
- Campo de busca global
- Ícone de notificações com contador
- Menu do usuário com avatar

## 🔧 Próximos Passos

1. Configurar React Router para navegação entre páginas
2. Implementar shadcn/ui components
3. Criar componentes de formulário reutilizáveis
4. Implementar módulo CRM
5. Integrar React Query para chamadas de API
6. Configurar Zustand para estado global

## 📚 Documentação de Referência

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
