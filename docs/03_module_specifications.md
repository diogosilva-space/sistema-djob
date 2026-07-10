# Especificações Detalhadas de Campos e Componentes por Módulo

## Sistema ERP/CRM DJOB

Este documento complementa o documento técnico principal, fornecendo especificações detalhadas de campos, validações e componentes para cada módulo do sistema. Estas especificações servem como guia direto para a implementação do frontend em React.

---

## 1. Módulo CRM

### 1.1. Cadastro de Clientes

**Rota:** `/crm/clientes/novo` | `/crm/clientes/:id/editar`

**Componente:** Formulário com Tabs (Shadcn/ui Tabs + Form)

#### Aba: Informações Gerais

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Tipo de Pessoa | RadioGroup | Sim | - | Opções: "Pessoa Física", "Pessoa Jurídica" |
| Razão Social / Nome | Input | Sim | min: 3 caracteres | Label muda conforme tipo de pessoa |
| Nome Fantasia | Input | Não | - | Visível apenas para PJ |
| CNPJ / CPF | Input com máscara | Sim | Validação de CNPJ/CPF | Máscara muda conforme tipo de pessoa |
| Inscrição Estadual | Input | Não | - | Visível apenas para PJ |
| Data de Cadastro | DatePicker (readonly) | Sim | - | Preenchido automaticamente |
| Segmento | Select | Sim | - | Opções: "Corporativo", "Escolas", "Eventos", "Varejo", "Governo" |
| Origem | Select | Não | - | Opções: "Indicação", "Site", "Redes Sociais", "Feira/Evento", "Prospecção Ativa" |
| Vendedor Responsável | Combobox | Sim | - | Lista de usuários com perfil "Vendedor" |
| Tags | MultiSelect | Não | - | Tags customizáveis: "Fiel", "Potencial", "Inativo", etc. |
| Observações | Textarea | Não | max: 500 caracteres | - |

#### Aba: Contatos

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Telefone Principal | Input com máscara | Sim | Formato telefone BR | - |
| WhatsApp | Input com máscara | Não | Formato telefone BR | Ícone do WhatsApp ao lado |
| E-mail | Input | Sim | Formato e-mail válido | - |
| Site | Input | Não | Formato URL | - |
| Contato Principal (Nome) | Input | Não | - | Nome da pessoa de contato |
| Cargo do Contato | Input | Não | - | - |

#### Aba: Endereços

**Componente:** Lista dinâmica de endereços (pode adicionar múltiplos)

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Tipo de Endereço | Select | Sim | - | Opções: "Faturamento", "Entrega", "Ambos" |
| CEP | Input com máscara + busca | Sim | Formato CEP | Busca automática via API ViaCEP |
| Logradouro | Input | Sim | - | Preenchido automaticamente pelo CEP |
| Número | Input | Sim | - | - |
| Complemento | Input | Não | - | - |
| Bairro | Input | Sim | - | Preenchido automaticamente pelo CEP |
| Cidade | Input | Sim | - | Preenchido automaticamente pelo CEP |
| Estado | Select | Sim | - | Preenchido automaticamente pelo CEP |

#### Aba: Comercial

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Limite de Crédito | Input numérico | Não | min: 0 | Formato moeda (R$) |
| Condição de Pagamento Padrão | Select | Não | - | Opções: "À Vista", "7 dias", "14 dias", "21 dias", "28 dias", "30/60/90" |
| Tabela de Preço | Select | Não | - | Permite preços diferenciados |

---

### 1.2. Pipeline de Vendas (Kanban)

**Rota:** `/crm/pipeline`

**Componente:** Kanban Board customizado com drag-and-drop

#### Colunas do Kanban (Configuráveis)

| Coluna Padrão | Cor | Descrição |
|---------------|-----|-----------|
| Lead Qualificado | Azul | Leads que passaram pela qualificação inicial |
| Contato Inicial | Amarelo | Primeiro contato realizado |
| Apresentação | Laranja | Apresentação de produtos/serviços realizada |
| Proposta Enviada | Roxo | Orçamento enviado ao cliente |
| Negociação | Ciano | Em fase de negociação de valores/condições |
| Fechado (Ganho) | Verde | Venda concretizada |
| Fechado (Perdido) | Vermelho | Oportunidade perdida |

#### Card de Oportunidade

| Informação | Componente | Observações |
|------------|------------|-------------|
| Nome do Cliente | Text (bold) | Link para o cadastro do cliente |
| Valor da Oportunidade | Text | Formato moeda (R$) |
| Probabilidade | Badge | Cor varia: <30% vermelho, 30-70% amarelo, >70% verde |
| Data da Última Interação | Text (small) | Formato relativo: "há 2 dias" |
| Vendedor | Avatar + Nome | - |
| Ações | Dropdown Menu | "Ver Detalhes", "Criar Orçamento", "Registrar Interação", "Mover para..." |

---

## 2. Módulo de Vendas

### 2.1. Criação de Orçamento

**Rota:** `/vendas/orcamentos/novo` | `/vendas/orcamentos/:id/editar`

**Componente:** Formulário de página única com seções

#### Seção: Cabeçalho do Orçamento

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Número do Orçamento | Input (readonly) | Sim | - | Gerado automaticamente |
| Cliente | Combobox com busca | Sim | - | Busca por nome, CNPJ ou código |
| Data de Emissão | DatePicker (readonly) | Sim | - | Data atual |
| Validade | Select | Sim | - | Opções: "15 dias", "30 dias", "60 dias" |
| Vendedor | Select | Sim | - | Usuário logado por padrão |
| Oportunidade Vinculada | Combobox | Não | - | Vincula ao pipeline do CRM |
| Observações Internas | Textarea | Não | max: 500 | Não aparece no PDF do orçamento |

#### Seção: Itens do Orçamento

**Componente:** Tabela editável (TanStack Table)

| Coluna | Tipo | Ações |
|--------|------|-------|
| Produto | Combobox com busca | Busca por SKU ou nome |
| Descrição | Text (readonly) | Preenchido automaticamente |
| Quantidade | Input numérico | min: 1 |
| Unidade | Text (readonly) | Preenchido automaticamente |
| Preço Unitário | Input numérico | Preenchido automaticamente, editável |
| Desconto (%) | Input numérico | 0-100% |
| Subtotal | Text (readonly) | Calculado automaticamente |
| Personalização | Button | Abre modal de personalização |
| Ações | IconButton | Remover item |

#### Modal: Detalhes da Personalização

**Componente:** Dialog (Shadcn/ui)

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Técnica de Personalização | Select | Sim | - | Ver tabela de técnicas abaixo |
| Número de Cores | Input numérico | Condicional | 1-10 | Visível para Serigrafia, Silk Screen |
| Posição da Arte | Select | Sim | - | "Frente", "Costas", "Manga", "360°", etc. |
| Tamanho da Arte | Select | Sim | - | "Pequeno (5x5cm)", "Médio (10x10cm)", "Grande (20x20cm)", "Personalizado" |
| Upload da Arte | FileUpload | Não | .ai, .pdf, .png, .jpg | Múltiplos arquivos permitidos |
| Observações da Personalização | Textarea | Não | max: 300 | Instruções especiais |
| Custo Calculado | Text (readonly) | - | - | Calculado automaticamente com base na técnica |

#### Tabela de Técnicas de Personalização

| Código | Técnica | Custo Base | Variáveis de Custo |
|--------|---------|------------|-------------------|
| BOR | Bordado | R$ 8,00 | Por 1000 pontos |
| ETQ | Etiquetas | R$ 0,50 | Por unidade |
| IMP | Impressão Digital | R$ 2,00 | Por cm² |
| SUB | Sublimação | R$ 5,00 | Por peça |
| LAS | Laser | R$ 3,00 | Por cm² |
| LAS360 | Laser Circular | R$ 5,00 | Por peça |
| HOT | Hot Stamping | R$ 4,00 | Por aplicação |
| SIL | Silk Screen | R$ 2,00 | Por cor |
| SIL360 | Silk Screen Circular | R$ 3,00 | Por cor |
| SILTEX | Silk Screen Têxtil | R$ 2,50 | Por cor |
| TAM | Tampografia | R$ 1,50 | Por cor |
| TRA | Transfer | R$ 3,00 | Por peça |
| UVD | UV Digital | R$ 4,00 | Por cm² |
| UV360 | UV Circular (360) | R$ 6,00 | Por peça |

#### Seção: Resumo Financeiro

**Componente:** Card fixo no rodapé da página

| Campo | Cálculo |
|-------|---------|
| Subtotal Produtos | Soma dos subtotais dos itens |
| Custo de Personalização | Soma dos custos de personalização |
| Frete Estimado | Calculado via API ou manual |
| Desconto Global (%) | Input editável |
| Desconto Global (R$) | Calculado |
| **TOTAL** | Subtotal + Personalização + Frete - Desconto |

---

## 3. Módulo de Produtos

### 3.1. Cadastro de Produto

**Rota:** `/produtos/novo` | `/produtos/:id/editar`

**Componente:** Formulário com Tabs

#### Aba: Informações Gerais

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| SKU | Input | Sim | Único | Gerado automaticamente ou manual |
| Nome do Produto | Input | Sim | min: 3 | - |
| Descrição Curta | Input | Sim | max: 100 | Usada em listas |
| Descrição Completa | RichTextEditor | Não | - | Usada no catálogo |
| Tipo de Produto | RadioGroup | Sim | - | "Brinde (Comprado)", "Confecção (Produzido)" |
| Categoria | Select | Sim | - | Categorias configuráveis |
| Subcategoria | Select | Não | - | Depende da categoria |
| Unidade de Medida | Select | Sim | - | "Unidade", "Par", "Kit", "Metro", "Kg" |
| Status | Switch | Sim | - | "Ativo" / "Inativo" |
| Imagem Principal | ImageUpload | Não | .png, .jpg, .webp | Thumbnail para listas |
| Galeria de Imagens | MultiImageUpload | Não | .png, .jpg, .webp | Até 10 imagens |

#### Aba: Estoque (Visível para Brindes)

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Estoque Atual | Input numérico (readonly) | - | - | Atualizado por movimentações |
| Estoque Mínimo | Input numérico | Sim | min: 0 | Gera alerta quando atingido |
| Estoque Máximo | Input numérico | Não | > Estoque Mínimo | - |
| Localização | Input | Não | - | Ex: "A-01-02" |
| Fornecedor Principal | Combobox | Não | - | Lista de fornecedores |
| Tempo de Reposição (dias) | Input numérico | Não | min: 1 | - |

#### Aba: Ficha Técnica / BOM (Visível para Confecção)

**Componente:** Tabela editável para lista de materiais

| Coluna | Tipo | Observações |
|--------|------|-------------|
| Material | Combobox | Busca na lista de matérias-primas |
| Quantidade | Input numérico | - |
| Unidade | Text (readonly) | Herdado do material |
| Custo Unitário | Text (readonly) | Herdado do material |
| Custo Total | Text (readonly) | Calculado |
| Ações | IconButton | Remover |

**Campos adicionais da Ficha Técnica:**

| Campo | Tipo de Componente | Obrigatório | Observações |
|-------|-------------------|-------------|-------------|
| Tempo de Produção Padrão (min) | Input numérico | Sim | Usado no PCP |
| Tamanhos Disponíveis | MultiSelect | Sim | "PP", "P", "M", "G", "GG", "XG" |
| Cores Disponíveis | ColorPicker (múltiplo) | Sim | - |

#### Aba: Custos e Preços

| Campo | Tipo de Componente | Obrigatório | Validação | Observações |
|-------|-------------------|-------------|-----------|-------------|
| Custo de Compra (Última) | Input numérico | Não | min: 0 | Para brindes |
| Custo Médio | Input numérico (readonly) | - | - | Calculado automaticamente |
| Custo de Produção | Input numérico (readonly) | - | - | Soma da BOM (para confecção) |
| Margem de Lucro Padrão (%) | Input numérico | Sim | 0-500% | - |
| Preço de Venda Sugerido | Input numérico (readonly) | - | - | Custo * (1 + Margem) |
| Preço de Venda Praticado | Input numérico | Sim | min: Custo | Pode ser diferente do sugerido |

---

## 4. Módulo de Produção

### 4.1. Ordem de Produção (OP)

**Rota:** `/producao/ordens/:id`

**Componente:** Página de detalhes com timeline

#### Cabeçalho da OP

| Campo | Tipo | Observações |
|-------|------|-------------|
| Número da OP | Text (bold) | Ex: "OP-2026-00123" |
| Status | Badge | "Aguardando Material", "Em Produção", "Finalizada", "Cancelada" |
| Pedido de Venda Vinculado | Link | Navega para o pedido |
| Cliente | Link | Navega para o cadastro do cliente |
| Produto | Link | Navega para o cadastro do produto |
| Quantidade | Text | - |
| Data de Emissão | Text | - |
| Data de Entrega Prometida | Text (highlight se atrasado) | - |
| Prioridade | Badge | "Alta" (vermelho), "Normal" (cinza), "Baixa" (azul) |

#### Timeline de Etapas de Produção

**Componente:** Stepper vertical customizado

| Etapa | Status Possíveis | Campos de Apontamento |
|-------|------------------|----------------------|
| Corte | Pendente, Em Andamento, Concluído | Data/Hora Início, Data/Hora Fim, Responsável, Quantidade Cortada, Observações |
| Costura | Pendente, Em Andamento, Concluído | Data/Hora Início, Data/Hora Fim, Responsável, Quantidade Costurada, Observações |
| Estamparia/Personalização | Pendente, Em Andamento, Concluído | Data/Hora Início, Data/Hora Fim, Responsável, Técnica Utilizada, Quantidade Personalizada, Observações |
| Acabamento | Pendente, Em Andamento, Concluído | Data/Hora Início, Data/Hora Fim, Responsável, Quantidade Acabada, Observações |
| Controle de Qualidade | Pendente, Em Andamento, Aprovado, Reprovado | Data/Hora, Responsável, Quantidade Aprovada, Quantidade Reprovada, Motivo da Reprovação |

#### Modal: Apontamento de Etapa

**Componente:** Dialog (Shadcn/ui)

| Campo | Tipo de Componente | Obrigatório | Observações |
|-------|-------------------|-------------|-------------|
| Etapa | Text (readonly) | - | - |
| Ação | RadioGroup | Sim | "Iniciar", "Finalizar" |
| Data/Hora | DateTimePicker | Sim | Padrão: agora |
| Responsável | Combobox | Sim | Lista de operadores |
| Quantidade Processada | Input numérico | Sim (para Finalizar) | - |
| Quantidade com Defeito | Input numérico | Não | - |
| Tipo de Defeito | Select | Condicional | Visível se Qtd Defeito > 0 |
| Observações | Textarea | Não | - |

---

## 5. Módulo Financeiro

### 5.1. Contas a Receber

**Rota:** `/financeiro/contas-receber`

**Componente:** Tabela com filtros e ações em lote

#### Filtros

| Filtro | Tipo de Componente | Opções |
|--------|-------------------|--------|
| Status | MultiSelect | "Em Aberto", "Parcialmente Pago", "Quitado", "Atrasado", "Cancelado" |
| Período de Vencimento | DateRangePicker | - |
| Cliente | Combobox | - |
| Vendedor | Select | - |

#### Colunas da Tabela

| Coluna | Tipo | Ordenável | Observações |
|--------|------|-----------|-------------|
| Checkbox | Checkbox | Não | Para ações em lote |
| Nº Documento | Text | Sim | Link para detalhes |
| Cliente | Text | Sim | Link para cadastro |
| Emissão | Date | Sim | - |
| Vencimento | Date | Sim | Destaque se atrasado |
| Valor Original | Currency | Sim | - |
| Valor Pago | Currency | Sim | - |
| Saldo | Currency | Sim | - |
| Status | Badge | Sim | Cores por status |
| Ações | Dropdown | Não | "Registrar Pagamento", "Ver Detalhes", "Enviar Cobrança" |

#### Modal: Registrar Pagamento

| Campo | Tipo de Componente | Obrigatório | Observações |
|-------|-------------------|-------------|-------------|
| Valor Recebido | Input numérico | Sim | Padrão: saldo em aberto |
| Data do Recebimento | DatePicker | Sim | Padrão: hoje |
| Forma de Pagamento | Select | Sim | "Dinheiro", "PIX", "Cartão Crédito", "Cartão Débito", "Boleto", "Transferência" |
| Conta de Destino | Select | Sim | Lista de contas bancárias |
| Observações | Textarea | Não | - |

---

## 6. Configurações

### 6.1. Usuários e Permissões

**Rota:** `/configuracoes/usuarios`

#### Perfis de Acesso Padrão

| Perfil | Módulos com Acesso | Restrições |
|--------|-------------------|------------|
| Administrador | Todos | Nenhuma |
| Gerente Comercial | Dashboard, CRM, Vendas, Produtos | Sem acesso a Financeiro (detalhado) |
| Vendedor | CRM (próprios clientes), Vendas (próprios orçamentos) | Sem acesso a custos e margens |
| Produção | Produção, Estoque | Sem acesso a valores financeiros |
| Financeiro | Dashboard, Financeiro | Sem acesso a Produção |
| Compras | Compras, Estoque, Fornecedores | Sem acesso a Vendas |

---

Este documento deve ser utilizado em conjunto com o documento técnico principal para guiar a implementação do frontend do sistema ERP/CRM da DJOB.
