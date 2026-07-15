# Especificações de Campos para Módulos de RH e Logística

## Sistema ERP/CRM DJOB

Este documento detalha os campos essenciais para os novos módulos de Recursos Humanos (RH) e Logística, com base na análise dos documentos operacionais fornecidos (`ficha-cadastro-funcionarios.docx` e `protocolodeentrega.docx`).

---

## 1. Módulo de Recursos Humanos (RH)

O módulo de RH será responsável pelo cadastro e gestão de funcionários e prestadores de serviço.

### 1.1. Cadastro de Funcionários

Esta tela visa digitalizar a "Ficha de Cadastro de Funcionários", centralizando todas as informações do colaborador em um único local.

**Rota Sugerida:** `/rh/funcionarios/novo` | `/rh/funcionarios/:id/editar`

**Componente:** Formulário com Tabs (Shadcn/ui Tabs + Form)

#### Aba: Dados Pessoais

| Campo              | Tipo de Componente | Obrigatório | Observações                                                             |
| ------------------ | ------------------ | ----------- | ----------------------------------------------------------------------- |
| Foto 3x4           | ImageUpload        | Não         | Componente para upload de imagem de perfil.                             |
| Nome Completo      | Input              | Sim         | -                                                                       |
| Data de Nascimento | DatePicker         | Sim         | -                                                                       |
| Naturalidade       | Input              | Não         | Cidade de nascimento.                                                   |
| UF Naturalidade    | Select             | Não         | Estado de nascimento.                                                   |
| Estado Civil       | Select             | Sim         | Opções: Solteiro(a), Casado(a), Divorciado(a), Viúvo(a), União Estável. |
| Nome do Cônjuge    | Input              | Condicional | Visível se Estado Civil for "Casado(a)" ou "União Estável".             |
| Nome do Pai        | Input              | Não         | -                                                                       |
| Nome da Mãe        | Input              | Sim         | -                                                                       |

#### Aba: Contato e Endereço

| Campo                 | Tipo de Componente        | Obrigatório | Observações                                    |
| --------------------- | ------------------------- | ----------- | ---------------------------------------------- |
| CEP                   | Input com máscara + busca | Sim         | Busca automática de endereço via API (ViaCEP). |
| Endereço (Logradouro) | Input                     | Sim         | Preenchido automaticamente pelo CEP.           |
| Número                | Input                     | Sim         | -                                              |
| Complemento           | Input                     | Não         | -                                              |
| Bairro                | Input                     | Sim         | Preenchido automaticamente pelo CEP.           |
| Cidade                | Input                     | Sim         | Preenchido automaticamente pelo CEP.           |
| UF                    | Select                    | Sim         | Preenchido automaticamente pelo CEP.           |
| Telefone Fixo         | Input com máscara         | Não         | -                                              |
| Celular / WhatsApp    | Input com máscara         | Sim         | -                                              |
| Telefone para Recados | Input com máscara         | Não         | -                                              |

#### Aba: Documentação

| Campo                       | Tipo de Componente | Obrigatório | Observações                            |
| --------------------------- | ------------------ | ----------- | -------------------------------------- |
| RG                          | Input              | Sim         | -                                      |
| Órgão Expedidor             | Input              | Sim         | -                                      |
| UF Expedição (RG)           | Select             | Sim         | -                                      |
| Data de Expedição (RG)      | DatePicker         | Sim         | -                                      |
| CPF                         | Input com máscara  | Sim         | Validação de CPF.                      |
| PIS/PASEP                   | Input              | Sim         | -                                      |
| Data de Cadastro (PIS)      | DatePicker         | Não         | -                                      |
| Carteira de Trabalho (CTPS) | Input              | Sim         | -                                      |
| Série (CTPS)                | Input              | Sim         | -                                      |
| Data de Expedição (CTPS)    | DatePicker         | Sim         | -                                      |
| Título de Eleitor           | Input              | Não         | -                                      |
| Zona Eleitoral              | Input              | Não         | -                                      |
| Seção Eleitoral             | Input              | Não         | -                                      |
| Carteira de Reservista      | Input              | Não         | Para funcionários do sexo masculino.   |
| Série (Reservista)          | Input              | Não         | -                                      |
| Categoria (Reservista)      | Input              | Não         | -                                      |
| CNH                         | Input              | Não         | -                                      |
| Categoria (CNH)             | Select             | Condicional | Opções: A, B, C, D, E, AB, AC, AD, AE. |
| Validade (CNH)              | DatePicker         | Condicional | -                                      |

#### Aba: Dados Contratuais

| Campo                          | Tipo de Componente     | Obrigatório | Observações                             |
| ------------------------------ | ---------------------- | ----------- | --------------------------------------- |
| Data de Admissão               | DatePicker             | Sim         | -                                       |
| Função/Cargo                   | Select                 | Sim         | Lista de cargos pré-cadastrados.        |
| Contrato de Experiência (dias) | Input numérico         | Sim         | Ex: 45, 90.                             |
| Salário Base                   | Input numérico (moeda) | Sim         | -                                       |
| Horário de Trabalho (Manhã)    | Input (time)           | Sim         | Ex: 08:00 às 12:00.                     |
| Horário de Trabalho (Tarde)    | Input (time)           | Sim         | Ex: 14:00 às 18:00.                     |
| Intervalo de Almoço            | Input (time)           | Sim         | Ex: 12:00 às 14:00.                     |
| Descanso Semanal               | Select                 | Sim         | Opções: Sábado e Domingo, Domingo, etc. |
| Desconto Vale Transporte (VT)  | Switch                 | Sim         | Opções: Sim/Não.                        |
| Recebe Seguro Desemprego?      | Switch                 | Não         | Para controle de admissão.              |
| Data do Requerimento (Seguro)  | DatePicker             | Condicional | Se o switch acima for "Sim".            |

#### Aba: Dados Bancários

| Campo                   | Tipo de Componente | Obrigatório | Observações                  |
| ----------------------- | ------------------ | ----------- | ---------------------------- |
| Banco                   | Select             | Sim         | Lista de bancos brasileiros. |
| Agência                 | Input              | Sim         | -                            |
| Conta Corrente/Poupança | Input              | Sim         | -                            |

#### Aba: Dependentes

**Componente:** Lista dinâmica para adicionar múltiplos dependentes.

| Campo              | Tipo de Componente | Obrigatório | Observações                     |
| ------------------ | ------------------ | ----------- | ------------------------------- |
| Nome do Dependente | Input              | Sim         | -                               |
| Data de Nascimento | DatePicker         | Sim         | -                               |
| Grau de Parentesco | Select             | Sim         | Opções: Filho(a), Cônjuge, etc. |
| CPF do Dependente  | Input com máscara  | Sim         | Validação de CPF.               |

---

## 2. Módulo de Logística

O módulo de Logística será responsável por formalizar e rastrear a entrega de produtos aos clientes.

### 2.1. Protocolo de Entrega

Esta tela visa gerar um documento digital ou para impressão que formaliza a entrega de mercadorias, baseado no documento "protocolodeentrega.docx".

**Rota Sugerida:** `/logistica/protocolos/novo` | `/logistica/protocolos/:id`

**Componente:** Formulário de página única.

| Campo                             | Tipo de Componente         | Obrigatório | Observações                                                          |
| --------------------------------- | -------------------------- | ----------- | -------------------------------------------------------------------- |
| Número do Protocolo               | Input (readonly)           | Sim         | Gerado automaticamente (ex: PE-2026-0001).                           |
| Pedido de Venda                   | Combobox com busca         | Sim         | Ao selecionar, carrega automaticamente o cliente e os itens.         |
| Data de Saída                     | DatePicker                 | Sim         | Data em que o produto saiu para entrega.                             |
| Endereço de Saída                 | Text (readonly)            | Sim         | Padrão: Endereço da DJOB.                                            |
| Destino (Cliente)                 | Text (readonly)            | Sim         | Carregado a partir do Pedido de Venda.                               |
| Itens do Pedido                   | Tabela (readonly)          | Sim         | Lista os itens, descrições e quantidades do pedido.                  |
| Entregue por (Motorista/Portador) | Select                     | Sim         | Lista de funcionários ou campo de texto.                             |
| Recebido por (Nome)               | Input                      | Sim         | Nome de quem recebeu a mercadoria.                                   |
| Documento do Recebedor (RG/CPF)   | Input                      | Não         | Para maior segurança na entrega.                                     |
| Data da Entrega                   | DateTimePicker             | Sim         | Data e hora exata da entrega.                                        |
| Assinatura do Recebedor           | SignaturePad / ImageUpload | Não         | Campo para assinatura digital ou upload da foto do canhoto assinado. |
| Status                            | Badge (readonly)           | Sim         | "Aguardando Entrega", "Entregue", "Recusado".                        |

---

Este documento fornece a base para a criação das telas dos módulos de RH e Logística. Os campos foram extraídos diretamente dos documentos operacionais para garantir que os processos atuais sejam refletidos e melhorados no novo sistema.
