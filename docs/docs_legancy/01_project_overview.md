# Documento Técnico e Especificação de UI/UX

## Sistema ERP/CRM para DJOB Brindes e Confecção

---

**Versão:** 1.0

**Data:** 27 de Janeiro de 2026

**Autor:** Manus AI

---

## Sumário

1.  **Introdução**
    1.1. Visão Geral do Projeto
    1.2. Objetivos do Sistema
2.  **Análise e Estudo de Caso**
    2.1. Cenário Atual da DJOB
    2.2. Análise da Proposta Inicial
    2.3. Estrutura de Módulos Recomendada
3.  **Arquitetura de Frontend e Tecnologia**
    3.1. Stack Tecnológica
    3.2. Análise e Escolha da Biblioteca de Componentes
    3.3. Justificativa da Escolha: Shadcn/ui
4.  **Design System e Identidade Visual**
    4.1. Paleta de Cores
    4.2. Tipografia
    4.3. Componentes Base (Botões, Inputs, Cards)
5.  **Especificações de UI/UX por Módulo**
    5.1. Layout Geral e Navegação
    5.2. Dashboard Principal
    5.3. CRM: Pipeline de Vendas
    5.4. Vendas: Tela de Criação de Orçamento
    5.5. Produtos: Tela de Cadastro
    5.6. Produção: Ordem de Produção
6.  **Fluxos de Trabalho (Workflows)**
    6.1. Workflow: Venda de Brinde Personalizado
    6.2. Workflow: Venda de Confecção Própria
7.  **Considerações Finais**

---

## 1. Introdução

### 1.1. Visão Geral do Projeto

Este documento detalha a especificação técnica e de design de interface (UI/UX) para a criação de um sistema de gestão integrado (ERP/CRM) para a empresa DJOB. O sistema visa unificar e otimizar as duas principais verticais de negócio da empresa: a comercialização de brindes personalizados e a confecção própria de produtos têxteis. O objetivo é criar uma plataforma centralizada que gerencie todos os processos, desde o relacionamento com o cliente e vendas até o controle de produção e financeiro, proporcionando uma base sólida para o crescimento escalável do negócio.

### 1.2. Objetivos do Sistema

- **Centralização da Informação:** Unificar dados de clientes, produtos, estoque, pedidos e finanças em uma única plataforma.
- **Otimização de Processos:** Automatizar e agilizar fluxos de trabalho, como a criação de orçamentos, ordens de produção e faturamento.
- **Controle Operacional:** Oferecer visibilidade e controle total sobre o estoque de produtos prontos e de matéria-prima, além de todas as etapas da produção de confecção.
- **Melhora no Relacionamento com o Cliente:** Implementar um CRM eficaz para gerenciar o pipeline de vendas, o histórico de interações e a satisfação do cliente.
- **Tomada de Decisão Baseada em Dados:** Fornecer dashboards e relatórios inteligentes (Business Intelligence) para uma análise precisa da performance do negócio.

---

## 2. Análise e Estudo de Caso

### 2.1. Cenário Atual da DJOB

A DJOB opera com duas linhas de produção distintas que necessitam de uma gestão integrada:

- **Brindes Personalizados (Comercialização):** Este modelo de negócio envolve a compra de produtos prontos (canecas, chaveiros, etc.), a personalização interna e a revenda. Os principais desafios são a gestão de estoque de produtos acabados, a agilidade na orçamentação e o controle do processo de personalização.

- **Confecção Têxtil (Produção):** Esta vertical é uma operação de manufatura completa, desde a compra de matéria-prima até a produção de peças de vestuário. Os desafios incluem a gestão de insumos, o planejamento e controle da produção (PCP), a apuração de custos e o controle de qualidade por etapa.

### 2.2. Análise da Proposta Inicial

A documentação inicial fornecida pelo cliente apresenta uma visão **excepcionalmente completa e bem-estruturada** para o sistema. A divisão em módulos e a implementação faseada são práticas recomendadas que serão adotadas. A proposta não é exagerada, mas sim ambiciosa, e serve como uma excelente base. A principal sugestão é **rebalancear a complexidade das fases iniciais**, movendo funcionalidades muito avançadas (como o simulador 3D do portal do cliente) para fases posteriores, a fim de garantir entregas de valor mais rápidas e seguras.

### 2.3. Estrutura de Módulos Recomendada

A estrutura de módulos a seguir foi refinada com base na proposta inicial e na análise do negócio, servindo como a arquitetura central de informação do sistema.

| Módulo Principal   | Sub-módulos / Funcionalidades Chave                                                              |
| :----------------- | :----------------------------------------------------------------------------------------------- |
| **Dashboard & BI** | KPIs de Vendas, Produção e Financeiro; Relatórios Gerenciais; Análises Preditivas.               |
| **CRM**            | Gestão de Clientes e Leads; Pipeline de Vendas; Histórico de Interações; Automação de Follow-up. |
| **Vendas**         | Orçamentos (com cálculo de custo de personalização); Pedidos de Venda; Portal do Cliente.        |
| **Produtos**       | Cadastro de Produtos (Brindes e Confecção); Ficha Técnica/BOM; Catálogo Virtual.                 |
| **Estoque**        | Controle de Estoque (Matéria-Prima, WIP, Acabado); Endereçamento; Inventário Cíclico.            |
| **Compras**        | Gestão de Fornecedores; Cotações; Pedidos de Compra; Gestão de Importação (se aplicável).        |
| **Produção (PCP)** | Ordens de Produção; Apontamento de Etapas; Controle de Qualidade; Gestão de Terceirização.       |
| **Financeiro**     | Contas a Pagar e a Receber; Fluxo de Caixa; Conciliação Bancária; Emissão de NF-e.               |
| **Configurações**  | Gestão de Usuários e Permissões; Parâmetros da Empresa; Templates (e-mail, orçamento).           |

---

## 3. Arquitetura de Frontend e Tecnologia

### 3.1. Stack Tecnológica

O frontend do sistema será desenvolvido utilizando as tecnologias mais modernas e eficientes para a criação de uma Single-Page Application (SPA) responsiva, performática e de fácil manutenção.

- **Framework:** React 18+
- **Linguagem:** TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS
- **Biblioteca de Componentes:** Shadcn/ui
- **Gerenciamento de Estado:** Zustand / React Query
- **Roteamento:** React Router

### 3.2. Análise e Escolha da Biblioteca de Componentes

Conforme solicitado, foi realizada uma análise comparativa entre as principais bibliotecas de UI para React em 2026, incluindo MUI (Material UI), Chakra UI, Mantine UI, Ant Design e Shadcn/ui. A escolha da biblioteca de componentes é uma decisão arquitetural crítica, pois impacta diretamente a produtividade do desenvolvimento, a performance da aplicação e a experiência do usuário final.

A análise considerou fatores como: nível de customização, performance (tamanho do bundle), disponibilidade de componentes complexos para um ambiente enterprise (ERP/CRM), qualidade da documentação, tamanho da comunidade, modernidade do design e facilidade de implementação de um design system customizado.

### 3.3. Justificativa da Escolha: Shadcn/ui

A biblioteca recomendada e escolhida para o projeto é a **Shadcn/ui**.

**Justificativa:**

1.  **Customização e Identidade Visual:** Diferente de bibliotecas como MUI ou Ant Design, que possuem um design system opinativo e marcante, o Shadcn/ui não é uma biblioteca de componentes tradicional. Ele fornece componentes como código-fonte que podem ser copiados e colados no projeto. Isso oferece controle total sobre o código, a estilização e o comportamento, permitindo a criação de uma interface que reflete perfeitamente a identidade visual da DJOB, sem as amarras de um design system externo.

2.  **Performance e Otimização:** A abordagem do Shadcn/ui resulta em um _bundle size_ final menor, pois apenas os componentes efetivamente utilizados são incorporados ao projeto. Além disso, por ser baseado em Tailwind CSS, ele se beneficia de todas as otimizações de performance que o framework de estilização oferece, como a purga de classes não utilizadas.

3.  **Modernidade e Ecossistema:** Shadcn/ui é a biblioteca que mais cresce em popularidade no ecossistema React, sendo a base para muitas ferramentas modernas, inclusive de geração de interfaces com IA. Sua abordagem é considerada o estado da arte para o desenvolvimento de UIs em React, garantindo que o projeto não nascerá com uma tecnologia legada.

4.  **Flexibilidade e Extensibilidade:** Para um ERP com módulos tão distintos, a flexibilidade é crucial. O Shadcn/ui, combinado com a potência do Tailwind CSS, permite criar desde simples formulários de CRM até complexos dashboards de produção com total liberdade de design, mantendo a consistência através de um `theme` centralizado.

Para componentes mais complexos não nativos do Shadcn/ui, como tabelas de dados avançadas e gráficos, serão utilizadas bibliotecas especializadas e líderes em suas categorias, como **TanStack Table** e **Recharts**, que se integram perfeitamente ao ecossistema Tailwind CSS.

---

## 4. Design System e Identidade Visual

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

---

## 5. Especificações de UI/UX por Módulo

Esta seção detalha o design da interface e a experiência do usuário para as principais telas do sistema, utilizando os componentes do Shadcn/ui e seguindo o Design System definido.

### 5.1. Layout Geral e Navegação

O sistema terá um layout de dashboard padrão, com uma barra de navegação lateral (sidebar) fixa à esquerda e a área de conteúdo principal à direita.

- **Sidebar:** Conterá os ícones e nomes dos módulos principais (Dashboard, CRM, Vendas, Produtos, Estoque, Compras, Produção, Financeiro, Configurações). O item de menu ativo será destacado com a cor primária.
- **Header:** A barra superior conterá o nome do usuário logado, um ícone de notificações, um campo de busca global e o logo da DJOB.
- **Responsividade:** O layout será totalmente responsivo. Em telas menores (mobile), a sidebar será recolhida e acessível através de um ícone de "menu hambúrguer".

### 5.2. Dashboard Principal

**Objetivo:** Fornecer uma visão geral e instantânea dos indicadores mais importantes do negócio.

- **Layout:** A tela será composta por uma grade de cards (componente `Card` do Shadcn/ui).
- **Componentes:**
  - **Cards de KPI:** Cards no topo da página exibindo números grandes e um ícone correspondente. Exemplos: "Faturamento do Mês", "Novos Clientes", "Pedidos em Aberto", "Ordens de Produção Ativas".
  - **Gráficos:**
    - **Vendas por Categoria:** Um gráfico de pizza (usando Recharts) comparando o faturamento de "Brindes" vs. "Confecção".
    - **Evolução do Faturamento:** Um gráfico de linhas mostrando o faturamento dos últimos 6 meses.
  - **Listas de Ação Rápida:**
    - **"Minhas Tarefas Hoje":** Uma lista de tarefas do CRM para o usuário logado.
    - **"Alertas do Sistema":** Notificações importantes, como "Estoque Baixo" para um determinado produto ou "Pedido Atrasado".

### 5.3. CRM: Pipeline de Vendas

**Objetivo:** Visualizar e gerenciar todas as oportunidades de negócio de forma intuitiva.

- **Layout:** Um quadro Kanban, onde cada coluna representa uma etapa do pipeline de vendas (ex: "Lead Qualificado", "Contato Inicial", "Proposta Enviada", "Negociação").
- **Componentes:**
  - **Colunas:** Cada coluna terá um título e um resumo do valor total das oportunidades naquela etapa.
  - **Cards de Oportunidade:** Cada oportunidade será um card que pode ser arrastado e solto (drag-and-drop) entre as colunas. O card exibirá o nome do cliente, o valor da oportunidade e a data da última interação.
  - **Filtros:** Botões de filtro (`Button` secundário) no topo da página para filtrar as oportunidades por vendedor, período ou segmento de cliente.

### 5.4. Vendas: Tela de Criação de Orçamento

**Objetivo:** Permitir a criação de orçamentos complexos de forma rápida e sem erros.

- **Layout:** Um formulário de uma única página, dividido em seções claras.
- **Componentes:**
  - **Seleção de Cliente:** Um campo de busca com autocompletar (`Combobox` do Shadcn/ui) para encontrar e selecionar o cliente.
  - **Itens do Orçamento:** Uma tabela (`Table` do TanStack Table) onde o vendedor pode adicionar produtos. Cada linha terá campos para quantidade, desconto e permitirá a adição de detalhes de personalização.
  - **Modal de Personalização:** Ao clicar em "Adicionar Personalização" em um item, um modal (`Dialog` do Shadcn/ui) será aberto. Este modal conterá campos para upload da arte, seleção da técnica de personalização (em um `Select`) e um campo de texto para observações. O custo da personalização será calculado automaticamente.
  - **Resumo Financeiro:** Uma área fixa no final da tela que atualiza em tempo real o subtotal, custos de personalização, frete, descontos e o valor total.

### 5.5. Produtos: Tela de Cadastro

**Objetivo:** Cadastrar e gerenciar todos os detalhes de produtos de brindes e de confecção.

- **Layout:** Abas (`Tabs` do Shadcn/ui) para separar as diferentes informações do produto.
- **Componentes:**
  - **Aba "Informações Gerais":** Formulário com campos (`Input`, `Textarea`, `Select`) para SKU, Nome, Descrição, Categoria, etc.
  - **Aba "Estoque/Matéria-Prima":** Campos para controle de estoque (para brindes) ou para a lista de materiais (BOM) para produtos de confecção. A BOM será uma tabela onde o usuário pode adicionar cada matéria-prima e a quantidade necessária.
  - **Aba "Custos e Preços":** Campos para definir o custo de compra/produção e as regras de precificação.

### 5.6. Produção: Ordem de Produção

**Objetivo:** Detalhar e acompanhar o progresso de uma ordem de produção.

- **Layout:** Uma página de detalhes com um cabeçalho informativo e uma linha do tempo vertical.
- **Componentes:**
  - **Cabeçalho:** Exibirá as informações principais da OP: número, cliente, produto a ser fabricado, quantidade e prazo de entrega.
  - **Linha do Tempo (Workflow):** Uma representação visual das etapas da produção (Corte, Costura, Estamparia, Acabamento, Qualidade). Cada etapa mostrará seu status (Pendente, Em Andamento, Concluído), a data de início/fim e o responsável. O usuário poderá clicar em cada etapa para ver mais detalhes ou fazer apontamentos de produção.

---

## 6. Fluxos de Trabalho (Workflows)

Os fluxos de trabalho a seguir ilustram a jornada do usuário através do sistema para os dois principais cenários de negócio da DJOB. O design da UI/UX deve ser otimizado para tornar essas jornadas o mais fluidas e eficientes possível.

### 6.1. Workflow: Venda de Brinde Personalizado

Este fluxo descreve o processo desde a prospecção de um cliente interessado em um brinde do catálogo até a entrega do produto final personalizado.

| Etapa             | Módulo Principal    | Ação do Usuário / Sistema                                                                                                              |
| :---------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Prospecção     | **CRM**             | Vendedor cadastra um novo Lead ou Oportunidade no pipeline.                                                                            |
| 2. Orçamentação   | **Vendas**          | Vendedor cria um novo orçamento, seleciona o cliente e adiciona produtos do catálogo.                                                  |
| 3. Personalização | **Vendas**          | No item do orçamento, o vendedor anexa a arte do cliente e seleciona a técnica de personalização. O sistema calcula o custo adicional. |
| 4. Aprovação      | **Vendas / Portal** | O sistema envia o orçamento com a prova virtual da arte para o cliente, que aprova digitalmente.                                       |
| 5. Pedido         | **Vendas**          | Com a aprovação, o orçamento é convertido em Pedido de Venda com um clique.                                                            |
| 6. Estoque        | **Estoque**         | O sistema automaticamente reserva os itens do Pedido de Venda no estoque de produtos prontos.                                          |
| 7. Produção       | **Produção**        | Uma Ordem de Serviço de Personalização é gerada para a equipe interna.                                                                 |
| 8. Faturamento    | **Financeiro**      | Após a personalização, o pedido é faturado, a NF-e é emitida e o status do pedido é atualizado para "Aguardando Expedição".            |
| 9. Expedição      | **Logística**       | A equipe de logística despacha o produto e atualiza o status para "Enviado", inserindo o código de rastreio.                           |
| 10. Pós-Venda     | **CRM**             | O sistema automaticamente cria uma tarefa de follow-up para o vendedor verificar a satisfação do cliente após 7 dias da entrega.       |

### 6.2. Workflow: Venda de Confecção Própria

Este fluxo descreve o processo mais complexo de venda de um produto que precisa ser fabricado pela DJOB.

| Etapa             | Módulo Principal   | Ação do Usuário / Sistema                                                                                                                       |
| :---------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Orçamento      | **Vendas**         | Vendedor cria um orçamento para um produto de confecção (ex: 100 camisetas). O custo é baseado na Ficha Técnica do produto.                     |
| 2. Pedido         | **Vendas**         | O orçamento é aprovado e convertido em Pedido de Venda.                                                                                         |
| 3. Análise de PCP | **Produção (PCP)** | O sistema verifica a disponibilidade do produto acabado em estoque. Se for insuficiente, gera uma **Ordem de Produção (OP)**.                   |
| 4. Planejamento   | **Produção (PCP)** | O sistema analisa a **BOM** da OP e verifica o estoque de matéria-prima. Se os insumos forem insuficientes, gera uma **Solicitação de Compra**. |
| 5. Compras        | **Compras**        | O comprador recebe a solicitação, realiza a cotação e gera o Pedido de Compra para o fornecedor de matéria-prima.                               |
| 6. Produção       | **Produção**       | Com a matéria-prima disponível, a OP é liberada e avança pelas etapas (corte, costura, etc.), com apontamentos em cada fase.                    |
| 7. Estoque        | **Estoque**        | Ao final da produção, o sistema dá entrada das 100 camisetas no estoque de produtos acabados e abate a matéria-prima consumida.                 |
| 8. Faturamento    | **Financeiro**     | O sistema vincula os produtos acabados ao Pedido de Venda original e o libera para faturamento e emissão de NF-e.                               |
| 9. Expedição      | **Logística**      | O processo de expedição segue o mesmo fluxo dos brindes personalizados.                                                                         |

---

## 7. Considerações Finais

Este documento serve como um guia completo para o desenvolvimento do frontend do sistema ERP/CRM da DJOB. Ele estabelece uma base sólida ao definir a arquitetura, a stack tecnológica, o design system e as especificações detalhadas de interface para os módulos e fluxos mais críticos.

A escolha pelo **Shadcn/ui e Tailwind CSS** garante que o sistema será moderno, performático e, acima de tudo, altamente customizável para refletir a identidade única da DJOB. O sucesso do projeto dependerá da aderência a estas especificações e da colaboração contínua entre as equipes de design, desenvolvimento e os stakeholders da DJOB para refinar e validar as funcionalidades durante o processo de implementação ágil.

O próximo passo é a criação de protótipos de alta fidelidade no Figma (se necessário) e o início do desenvolvimento do frontend, seguindo a implementação faseada proposta, começando pelo CRM básico, cadastro de produtos e o módulo de vendas/orçamentos.
