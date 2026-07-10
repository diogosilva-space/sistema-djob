# 🚀 Sistema DJOB - ERP/CRM

Sistema integrado de gestão (ERP/CRM) para a DJOB Brindes e Confecção. Frontend moderno construído com React, TypeScript e Tailwind CSS.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológica](#stack-tecnológica)
- [Instalação e Uso](#instalação-e-uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Próximos Passos](#próximos-passos)
- [Documentação](#documentação)

## 📖 Sobre o Projeto

O Sistema DJOB é uma plataforma centralizada que gerencia todos os processos da empresa, desde o relacionamento com o cliente e vendas até o controle de produção e financeiro, proporcionando uma base sólida para o crescimento escalável do negócio.

### Principais Objetivos

- ✅ Centralização da Informação
- ✅ Otimização de Processos
- ✅ Controle Operacional
- ✅ Melhora no Relacionamento com o Cliente
- ✅ Tomada de Decisão Baseada em Dados

## 🛠️ Stack Tecnológica

### Core
- **React 18.3+** - Framework frontend
- **TypeScript** - Linguagem de programação
- **Vite 6.0** - Build tool e dev server

### UI/UX
- **Tailwind CSS 3.4** - Framework de estilização utility-first
- **shadcn/ui** - Biblioteca de componentes (Button, Card, Input, Select, Form, etc.)
- **Radix UI** - Primitivos de UI acessíveis
- **Lucide React** - Ícones

### Gerenciamento de Estado e Dados
- **React Router 7** - Roteamento SPA
- **TanStack Query (React Query)** - Gerenciamento de estado servidor e cache
- **Zustand** - Gerenciamento de estado global UI (configurado, não implementado ainda)

### Utilitários
- **clsx** + **tailwind-merge** - Merge de classes CSS
- **class-variance-authority** - Variantes de componentes

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone [url-do-repositório]

# Entre no diretório
cd sistema-djob

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

### Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:5173/

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar linter
npm run lint
```

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Imagens, fontes, etc.
├── components/          # Componentes de UI globais
│   ├── ui/             # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   └── form.tsx
│   ├── AppLayout.tsx   # Layout principal
│   ├── Header.tsx      # Cabeçalho
│   ├── Sidebar.tsx     # Menu lateral
│   └── ExampleForm.tsx # Exemplo de formulário
├── config/             # Arquivos de configuração
├── features/           # Módulos por funcionalidade (feature-based)
├── hooks/              # Hooks React customizados
│   └── useApi.ts       # Hooks de API
├── lib/                # Funções utilitárias
│   ├── utils.ts        # Utilitários gerais
│   └── api.ts          # Cliente HTTP
├── pages/              # Componentes de página
│   ├── DashboardPage.tsx
│   ├── CRMPage.tsx
│   ├── VendasPage.tsx
│   ├── ProdutosPage.tsx
│   ├── EstoquePage.tsx
│   ├── ComprasPage.tsx
│   ├── ProducaoPage.tsx
│   ├── FinanceiroPage.tsx
│   └── ConfiguracoesPage.tsx
├── providers/          # Provedores de contexto
│   └── QueryProvider.tsx
├── routes/             # Configuração de rotas
│   └── index.tsx
└── styles/             # Estilos globais
    └── index.css
```

## ✨ Funcionalidades Implementadas

### Layout e Navegação
- ✅ Layout responsivo com sidebar e header
- ✅ Menu de navegação com 9 módulos
- ✅ Indicador visual de rota ativa
- ✅ Suporte mobile com menu colapsável
- ✅ Busca global (UI pronta, lógica pendente)
- ✅ Sistema de notificações (UI pronta)
- ✅ Menu do usuário (UI pronto)

### Páginas dos Módulos
Todas as páginas possuem layout base com:
- Cards de KPIs e estatísticas
- Áreas para listas e tabelas (placeholders)
- Botões de ação
- Design System da DJOB aplicado

**Módulos:**
1. **Dashboard** - Visão geral com KPIs principais
2. **CRM** - Gestão de clientes e pipeline
3. **Vendas** - Orçamentos e pedidos
4. **Produtos** - Catálogo de produtos
5. **Estoque** - Controle de estoque
6. **Compras** - Pedidos de compra
7. **Produção** - Ordens de produção (PCP)
8. **Financeiro** - Contas a pagar/receber
9. **Configurações** - Configurações do sistema

### Componentes UI (shadcn/ui)
- ✅ **Button** - Com variantes (default, outline, destructive, etc.)
- ✅ **Card** - Para containers de conteúdo
- ✅ **Input** - Campos de entrada
- ✅ **Label** - Labels para formulários
- ✅ **Select** - Dropdown
- ✅ **Textarea** - Campo de texto multilinha
- ✅ **Form** - Sistema completo de formulários com validação

### React Query
- ✅ QueryProvider configurado
- ✅ Hooks customizados (`useApiQuery`, `useApiMutation`)
- ✅ Cliente HTTP com suporte a GET, POST, PUT, PATCH, DELETE
- ✅ Configuração otimizada (stale time, retry, etc.)

## 🎯 Próximos Passos

### Fase 1 - CRM Completo
- [ ] Formulário de cadastro de cliente (com abas)
- [ ] Componente Kanban para pipeline de vendas
- [ ] Sistema de tags
- [ ] Integração com API ViaCEP

### Fase 2 - Vendas
- [ ] Formulário de criação de orçamento
- [ ] Modal de personalização de produtos
- [ ] Cálculo automático de custos
- [ ] Geração de PDF

### Fase 3 - Produtos
- [ ] Cadastro completo com tabs
- [ ] Upload de imagens
- [ ] BOM (Bill of Materials)
- [ ] Integração com estoque

### Fase 4 - Componentes Avançados
- [ ] TanStack Table para listas
- [ ] Recharts para gráficos
- [ ] Date Picker
- [ ] File Upload
- [ ] Toast notifications
- [ ] Dialog/Modal
- [ ] Tabs

### Fase 5 - Backend
- [ ] Configurar backend API
- [ ] Autenticação e autorização
- [ ] Integração real com React Query
- [ ] Testes unitários e E2E

## 📚 Documentação

Para mais informações detalhadas, consulte:

- [PROJECT_SETUP.md](PROJECT_SETUP.md) - Guia de setup inicial
- [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Status detalhado da implementação
- [docs/01_project_overview.md](docs/01_project_overview.md) - Visão geral do projeto
- [docs/02_design_system.md](docs/02_design_system.md) - Design System e UI/UX
- [docs/03_module_specifications.md](docs/03_module_specifications.md) - Especificações dos módulos

### Regras de Desenvolvimento
- `.cursor/rules/component_structure.mdc` - Estrutura de arquivos e componentes
- `.cursor/rules/tech_stack.mdc` - Stack de tecnologia e bibliotecas
- `AGENTS.md` - System prompt para o agente de desenvolvimento

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#8BC34A` (Verde DJOB)
- **Secundária**: `#FF4081` (Rosa/Vermelho)
- **Background**: `#F8FAFC`
- **Cards**: `#FFFFFF`
- **Texto Principal**: `#1E293B`
- **Texto Secundário**: `#64748B`
- **Bordas**: `#E2E8F0`

### Tipografia
- **Fonte**: Inter (Google Fonts)
- **h1**: 24px, Bold
- **h2**: 20px, SemiBold
- **body**: 14px, Regular
- **small**: 12px, Regular

## 📝 Exemplos de Código

### Usando Componentes UI

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clique aqui</Button>
      </CardContent>
    </Card>
  );
}
```

### Usando React Query

```tsx
import { useApiQuery, useApiMutation } from '@/hooks/useApi';

function ClientesList() {
  const { data, isLoading } = useApiQuery('/clientes', ['clientes']);
  
  const mutation = useApiMutation('/clientes', 'POST');

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {data?.map(cliente => <div key={cliente.id}>{cliente.nome}</div>)}
    </div>
  );
}
```

## 🤝 Contribuindo

Este projeto segue uma estrutura modular e regras bem definidas. Antes de contribuir:

1. Leia a documentação em `/docs`
2. Siga as regras definidas em `.cursor/rules/`
3. Consulte o `AGENTS.md` para entender o workflow

## 📄 Licença

[Definir licença]

## 👥 Equipe

Desenvolvido para a DJOB Brindes e Confecção

---

**Status do Projeto:** 🟢 Em Desenvolvimento Ativo

**Última Atualização:** 27 de Janeiro de 2026
