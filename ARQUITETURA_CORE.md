# 🏛️ D.job System - Core Architecture & Business Rules

## 1. Visão Geral do Produto

O D.job System é um ERP/CRM projetado para uma empresa que atua com um modelo de negócio híbrido[cite: 12]. O sistema unifica duas verticais distintas:

- **Brindes Personalizados:** Produtos comprados prontos e personalizados[cite: 12].
- **Confecção Têxtil:** Produtos fabricados internamente (manufatura completa)[cite: 12].

A aplicação deve ser tratada como um sistema de **alta densidade informacional** para uso operacional contínuo (8h/dia).

## 2. Regras de Negócio e Manufatura

O sistema utiliza o conceito de **Mixed-Mode Manufacturing**, adaptando-se a dois fluxos de forma transparente[cite: 12, 13]:

- **MTS (Make to Stock):** Utilizado para produtos de alto giro (ex: canecas brancas, chaveiros)[cite: 12]. O sistema identifica o estoque e permite orçamento direto[cite: 12].
- **CTO (Configure to Order) / MTO:** Utilizado para confecção sob demanda[cite: 12, 13]. Se o item não possui estoque, o vendedor configura o produto (tecido, cor, gola, personalização) no ato da venda[cite: 12].

### 2.1. O Orçamento Inteligente

- Não existem "dois formulários" separados. O orçamento final apresentado ao cliente é o mesmo documento, independentemente de o produto estar em estoque ou ser fabricado[cite: 12].
- **O Configurador de Produto:** Para itens CTO, o sistema abre um _Drawer_ lateral (ocupando ~60% da tela à direita) com um _stepper_ vertical[cite: 12]. Ele calcula em tempo real o custo de matéria-prima (BOM), mão de obra e personalização[cite: 12].

## 3. Stack Tecnológica Definitiva

O agente deve respeitar ESTA stack e ignorar qualquer configuração anterior legada:

- **Frontend Core:** Next.js 15+ (App Router), React 19, TypeScript (Strict Mode).
- **Estilização e UI:** Tailwind CSS v4 e componentes Shadcn/ui (estilo New York).
- **Formulários e Validação:** React Hook Form + Zod. **Regra estrita:** Toda submissão de dados complexos deve ser validada no cliente via Zod.
- **Gerenciamento de Dados no Cliente:** TanStack Query v5 (cache) e TanStack Table v8 (tabelas densas).
- **Backend / API:** API RESTful consumida via Node.js (NestJS).
- **Banco de Dados:** PostgreSQL estruturado através do Prisma ORM.

## 4. Diretrizes de Design UI/UX (Anti Over-Engineering)

O design deve priorizar clareza e legibilidade.

1. **Tipografia:** Uso exclusivo da fonte **Inter** (pesos 300 a 700). Proibido trocar para Geist ou fontes experimentais.
2. **Componentes Limpos:** **Estritamente proibido** o uso de _Glassmorphism_ (desfoque/transparência)[cite: 11]. Utilize apenas sombreamento padrão (`box-shadow`) e bordas sutis para separar hierarquias[cite: 11].
3. **Animações Restritas:** Evite micro-animações como `scale` em _hover_ de cards em listagens para não prejudicar a performance e a usabilidade em massa[cite: 11].
4. **Navegação:** A _sidebar_ não deve listar itens infinitamente. Os menus devem possuir **Grupos Colapsáveis** (Comercial, Operacional, Administrativo, Sistema) para reduzir a carga cognitiva[cite: 11].
