# Guia de Operação e Scripts - D.job System

Este documento serve como manual operacional e de infraestrutura para desenvolvedores e administradores do D.job System.

---

## 🚀 Inicialização Rápida (Bootstrap)

Para inicializar todo o ambiente de desenvolvimento local (instalação de dependências, criação de variáveis de ambiente, migração do banco de dados e execução do seed demo), execute o script na raiz do projeto:

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

### O que o script faz:

1. Instala as dependências gerais do monorepo usando o `npm`.
2. Cria o arquivo `.env` com configurações padrões a partir do `.env.example`.
3. Sincroniza o schema do Prisma com o banco de dados PostgreSQL (`npx prisma db push`).
4. Compila os pacotes compartilhados (`@djob/validators` e `@djob/database`).
5. Popula o banco de dados com dados de teste (Tenant Demo, Usuário Administrador e dados iniciais).

---

## 📦 Scripts Operacionais Disponíveis

Todos os scripts devem ser executados a partir da raiz do monorepo:

### Desenvolvimento

- **Iniciar todas as aplicações em modo de desenvolvimento:**
  ```bash
  npm run dev
  ```
  - **Frontend (Next.js):** Acessível em `http://localhost:3000`
  - **Backend (NestJS):** Acessível em `http://localhost:3001`

### Compilação (Build)

- **Compilar todo o monorepo:**
  ```bash
  npm run build
  ```
- **Compilar apenas o frontend:**
  ```bash
  npm run build --workspace=web
  ```
- **Compilar apenas o backend:**
  ```bash
  npm run build --workspace=api
  ```

### Qualidade de Código (Linting & Formatação)

- **Rodar o linter (ESLint):**
  ```bash
  npm run lint
  ```
- **Formatar os arquivos (Prettier):**
  ```bash
  npm run format
  ```

---

## 🗄️ Banco de Dados (Prisma & Postgres)

O gerenciamento do banco de dados PostgreSQL é feito usando o Prisma ORM.

- **Visualizar o banco de dados graficamente (Prisma Studio):**
  ```bash
  npx prisma studio --schema=packages/database/prisma/schema.prisma
  ```
- **Criar e aplicar uma nova migração:**
  ```bash
  npx prisma migrate dev --schema=packages/database/prisma/schema.prisma
  ```
- **Gerar o cliente Prisma novamente:**
  ```bash
  npx prisma generate --schema=packages/database/prisma/schema.prisma
  ```

---

## 📖 Documentação da API (OpenAPI / Swagger)

O backend possui suporte nativo à geração de especificação OpenAPI 3.0.

- **Acessar a documentação interativa (Swagger UI):**
  - URL local: `http://localhost:3001/api/docs`
  - Contém todas as rotas de Auth, CRM, Vendas, PCP, Estoque, Compras, Financeiro e Recursos Humanos.
  - Todas as rotas expostas estão categorizadas e decoradas com `@ApiTags` para melhor organização visual.
