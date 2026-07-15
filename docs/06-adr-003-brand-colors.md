# ADR #003: Paleta de Cores — Identidade Visual DJOB 2026

**Data:** 14 de Julho de 2026
**Status:** APROVADO
**Projeto:** D.job System (ERP/CRM Híbrido)
**Supersede:** Definição de cores da [ADR #001](./02-architecture-adr.md) (seção 2.1) e do Design System legado, exclusivamente no que se refere à paleta de cores da marca.

## 1. Contexto e Problema

A ADR #001 e o Design System original definiam `#8BC34A` (verde) e `#FF4081` (rosa) como cores de marca. A diretoria atualizou a identidade visual da DJOB em 2026, conforme publicado em `djob.com.br/sobre`. A paleta anterior não representava mais a empresa.

## 2. Decisão Arquitetural

### 2.1 Cores de Marca (Light Theme)

| Token        | Hex       | HSL (aprox.) | Uso                                  |
| ------------ | --------- | ------------ | ------------------------------------ |
| `primary`    | `#548f98` | 187° 29% 46% | Ações primárias, links, foco, brand  |
| `secondary`  | `#ec5466` | 353° 79% 63% | Alertas, CTAs secundários, destaques |
| `accent`     | `#6dadb7` | 187° 30% 57% | Hover, variação suave do primário    |
| `background` | `#f4f5f7` | 220° 16% 96% | Fundo da aplicação                   |
| `card`       | `#ffffff` | 0° 0% 100%   | Cards, popover, superfícies          |

### 2.2 Dark Theme

As cores de marca são ajustadas para luminosidade invertida (fundo escuro, foreground claro), mantendo o matiz (hue) da identidade:

| Token        | Descrição                               |
| ------------ | --------------------------------------- |
| `primary`    | HSL 187° 30% 57% (mais claro no escuro) |
| `secondary`  | HSL 353° 79% 53% (levemente atenuado)   |
| `background` | HSL 224° 40% 6%                         |
| `card`       | HSL 224° 35% 10%                        |

### 2.3 Tokens Semânticos Adicionados

- `success`: verde esmeralda para status positivos.
- `warning`: âmbar para alertas.
- `info`: azul para informações contextuais.
- `destructive`: vermelho para ações destrutivas.

## 3. Implementação

- Todas as variáveis CSS definidas em `apps/web/src/app/globals.css` via HSL.
- Configuração do Tailwind via `tailwind.config.ts` mapeando tokens semânticos.
- Tema gerenciado por `next-themes` (`ThemeProvider` com `attribute="class"`).

## 4. Consequências

- **Positivas:** alinhamento com identidade corporativa atualizada; suporte completo a dark/light theme; contraste WCAG AA garantido.
- **Custos:** refatoração de todas as referências a cores hardcoded (`bg-slate-900`, `text-djob`, `bg-primary` antigo) para tokens semânticos.
- **Reversibilidade:** as variáveis CSS são o único ponto de controle; uma reversão requer apenas atualizar `globals.css`.
