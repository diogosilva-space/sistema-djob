# Design do Módulo CRM

**Status:** APROVADO  
**Data:** 15 de julho de 2026  
**Escopo:** CRM comercial e base unificada de contatos

## Contexto e objetivo

O cadastro de clientes e fornecedores é uma entidade compartilhada pelo ERP, enquanto o CRM é o espaço de trabalho comercial. A solução separa essas responsabilidades:

- `/contacts`: base cadastral de clientes e fornecedores, compartilhada por vendas e compras;
- `/crm`: pipeline comercial, oportunidades, tarefas, atividades e métricas.

O módulo atende vendedores internos, vendedores externos e gestores comerciais. O objetivo é evitar perda de negociações, concentrar o histórico de relacionamento e dar visibilidade operacional ao gestor.

## Requisitos não funcionais

- Todo acesso é isolado por `tenantId`.
- Vendedores acessam suas oportunidades; ADMIN e MANAGER podem acompanhar o tenant inteiro.
- A escala inicial é de até 5 vendedores, 200 contatos e 50 oportunidades simultâneas por tenant.
- O pipeline deve ser responsivo: Kanban em telas médias/grandes e lista agrupada em telas menores que `768px`.
- Para consultas recorrentes, atividades e tarefas recebem índices compostos por tenant e relação.

## Decisões arquiteturais

| Decisão                                 | Alternativas                         | Motivo                                                                  |
| --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| Separar contatos e CRM                  | Rota única, CRM centrado em contato  | Cadastro é infraestrutura do ERP; pipeline é fluxo comercial.           |
| Unificar Customer e Supplier em Contact | Manter tabelas duplicadas            | Permite um contato ser cliente, fornecedor ou ambos e reduz duplicação. |
| Entregar pipeline antes da migração     | Migração antes de tudo               | P0-a entrega valor com `Customer` existente e reduz risco.              |
| Kanban como visão padrão                | Lista como única visão               | É o padrão operacional mais adequado para equipes comerciais pequenas.  |
| Atividade manual rápida no P0-a         | Automação externa imediata           | Evita dependências de WhatsApp/e-mail antes de validar o fluxo.         |
| `@dnd-kit` para arrastar oportunidades  | Bibliotecas legadas de drag-and-drop | Biblioteca acessível e mantida para React.                              |
| Indicador de negociação parada          | Qualquer atividade reseta o alerta   | Apenas CALL, EMAIL, MEETING e WHATSAPP atualizam interação relevante.   |

## Modelo de domínio

### P0-a: pipeline com clientes existentes

`Opportunity` permanece vinculado a `Customer`, e passa a possuir:

- `lostReason`, obrigatório ao encerrar como perdido;
- `activities`, que registram chamadas, e-mails, reuniões, WhatsApp e notas;
- `tasks`, que representam follow-ups atribuídos a um vendedor.

`lastInteractionAt` é atualizado somente pelas atividades de contato real e permite calcular oportunidades sem interação sem fazer joins pesados.

### P0-b: contato unificado

`Contact` substitui `Customer` e `Supplier` com `role: CLIENT | SUPPLIER | BOTH`. A migração é feita em etapas e os modelos antigos só são removidos após todos os módulos dependentes terem sido migrados.

## Contratos da API

### Oportunidades

- `GET /opportunities`: lista filtrável por status, vendedor, período e busca;
- `GET /opportunities/pipeline`: oportunidades agrupadas por etapa;
- `GET /opportunities/metrics`: valor total, valor ponderado, taxa de ganho e oportunidades sem atividade;
- `POST /opportunities`, `PATCH /opportunities/:id`;
- `PATCH /opportunities/:id/stage`: movimentação de Kanban; exige motivo ao perder.

### Atividades e tarefas

- `GET/POST /activities`, `DELETE /activities/:id`;
- `GET/POST/PATCH/DELETE /tasks`;
- `PATCH /tasks/:id/complete`.

## Experiência de uso

O pipeline mostra cinco etapas abertas, com Ganho e Perdido recolhidos. Cada coluna exibe quantidade e valor acumulado. O card mostra nome da oportunidade, contato, valor, previsão de fechamento, responsável e alerta de negociação parada.

Ao mover um card:

- para ganho: é solicitado valor final e data de fechamento;
- para perdido: o motivo de perda é obrigatório;
- em caso de falha de rede: o card retorna ao estágio anterior e a interface informa o erro.

O detalhe da oportunidade usa timeline central para atividades e uma coluna lateral para contato e tarefas. O cadastro rápido no pipeline permite criar um cliente mínimo sem desviar do fluxo comercial.

## Fases

### P0-a — Pipeline funcional

Models Activity e Task, endpoints protegidos, Kanban, detalhe de oportunidade, tarefas, atividades, filtros e KPIs.

### P0-b — Contatos unificados

Model Contact, migração transacional, rota `/contacts`, visão 360° e atualização gradual dos módulos de vendas, compras e financeiro.

### P1

Click-to-WhatsApp, lembretes automáticos, segmentação, lista de oportunidades e relatórios comerciais.

### P2

WhatsApp Business API, e-mail integrado, sequências de automação, importação de contatos e previsão de vendas.

## Riscos e mitigação

- **Migração de dados:** executar em staging com backup e manter endpoints antigos enquanto os consumidores são migrados.
- **Vazamento entre tenants:** todas as consultas recebem `tenantId` do JWT e os testes cobrem isolamento.
- **Atualização otimista do Kanban:** rollback e toast em caso de erro.
- **Adoção pelos vendedores:** formulários de atividade e tarefa são reduzidos ao mínimo necessário.
