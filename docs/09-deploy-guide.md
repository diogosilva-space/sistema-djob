# Guia de Deploy — D.job System

**Status:** APROVADO  
**Data:** 15/07/2026  
**Plano:** Oracle Cloud Free Tier + Vercel Free

---

## Arquitetura de Produção

```
Usuário
  │
  ├──► app.djob.com.br ──► Vercel (Next.js — CDN global, deploy automático)
  │
  └──► api.djob.com.br ──► Oracle Cloud Free Tier (São Paulo)
                              │
                              ├── Nginx (reverse proxy + SSL)
                              ├── API NestJS (container Docker)
                              └── PostgreSQL 17 (container Docker)
```

**Custo: R$ 0/mês** (ambos os planos gratuitos)

---

## PARTE 1: Oracle Cloud (Backend + Database)

### Recursos do Free Tier utilizados

| Recurso | Especificação                             |
| ------- | ----------------------------------------- |
| VM      | Ampere A1 Flex — 4 OCPUs, 24 GB RAM (ARM) |
| Disco   | 200 GB boot volume                        |
| Rede    | 10 TB/mês outbound                        |
| IP      | 1 IP público reservado                    |

---

### PASSO 1: Criar a VM no Oracle Cloud

1. Acesse [cloud.oracle.com](https://cloud.oracle.com/?region=sa-saopaulo-1)

2. No painel principal, clique em **"Create a VM instance"**

3. Configure a instância:

   **Name:**

   ```
   djob-server
   ```

   **Placement:** Mantenha o padrão (AD-1 São Paulo)

   **Image and shape:**
   - Clique em **"Change image"** → selecione **"Canonical Ubuntu 22.04"** (ou 24.04)
   - Clique em **"Change shape"** →
     - Shape series: **Ampere** (ARM)
     - Shape: **VM.Standard.A1.Flex**
     - OCPUs: **4** (máximo gratuito)
     - Memory: **24 GB** (máximo gratuito)

   **Networking:**
   - Selecione/crie uma VCN (Virtual Cloud Network)
   - Marque: **"Assign a public IPv4 address"** ✅

   **Add SSH keys:**
   - Selecione **"Generate a key pair"** e **baixe ambas as chaves** (pública e privada)
   - Ou selecione **"Paste public keys"** se você já tem uma chave SSH

   **Boot volume:**
   - Tamanho: **100 GB** (suficiente, fica dentro dos 200 GB gratuitos)

4. Clique em **"Create"** e aguarde ficar **RUNNING** (2-5 minutos)

5. **Anote o IP público** — você vai precisar dele. Aparece na página da instância.

> **IMPORTANTE:** Se aparecer erro "Out of capacity", tente outro AD (Availability Domain)
> ou tente em horários diferentes. Recursos ARM são concorridos no Free Tier.

---

### PASSO 2: Abrir portas 80 e 443 no Firewall da Oracle

A Oracle bloqueia tudo por padrão. Precisamos abrir HTTP e HTTPS.

1. Na página da instância, clique na **Subnet** (link azul na seção Networking)

2. Clique na **Security List** (geralmente "Default Security List for ...")

3. Clique em **"Add Ingress Rules"** e adicione:

   **Regra 1 — HTTP:**

   | Campo                  | Valor       |
   | ---------------------- | ----------- |
   | Source Type            | CIDR        |
   | Source CIDR            | `0.0.0.0/0` |
   | IP Protocol            | TCP         |
   | Destination Port Range | `80`        |
   | Description            | HTTP        |

   **Regra 2 — HTTPS:**

   | Campo                  | Valor       |
   | ---------------------- | ----------- |
   | Source Type            | CIDR        |
   | Source CIDR            | `0.0.0.0/0` |
   | IP Protocol            | TCP         |
   | Destination Port Range | `443`       |
   | Description            | HTTPS       |

4. Clique **"Add Ingress Rules"**

---

### PASSO 3: Conectar via SSH

No seu terminal (Mac/Linux):

```bash
# Ajustar permissão da chave (se baixou do Oracle)
chmod 400 ~/Downloads/ssh-key-*.key

# Conectar (substitua o IP e caminho da chave)
ssh -i ~/Downloads/ssh-key-XXXX.key ubuntu@SEU_IP_PUBLICO
```

> **Usuário padrão:** `ubuntu` para Ubuntu, `opc` para Oracle Linux

Se conectou com sucesso, você verá o prompt do servidor.

---

### PASSO 4: Instalar Docker e preparar o servidor

Rode o script de setup automatizado (ou copie os comandos manualmente):

```bash
# Opção A: Baixar e rodar o script (após clonar o repo)
git clone https://github.com/SEU_USUARIO/sistema-djob.git ~/djob
cd ~/djob
bash infra/setup-server.sh

# Opção B: Comandos manuais, um por um
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# IMPORTANTE: Desconecte e reconecte para aplicar o grupo docker
exit
```

Após o `exit`, reconecte via SSH:

```bash
ssh -i ~/Downloads/ssh-key-XXXX.key ubuntu@SEU_IP_PUBLICO

# Verificar que Docker funciona sem sudo
docker --version
docker compose version
```

Se `docker compose version` falhar:

```bash
sudo apt install -y docker-compose-plugin
```

---

### PASSO 5: Abrir portas no firewall do Ubuntu (iptables)

O Oracle Cloud usa iptables no Ubuntu. O firewall da OCI (Passo 2) libera na rede, mas o iptables do sistema pode bloquear:

```bash
# Verificar regras atuais
sudo iptables -L INPUT -n --line-numbers

# Adicionar regras para HTTP e HTTPS
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT

# Salvar regras (persistem após reboot)
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

---

### PASSO 6: Configurar variáveis de ambiente

```bash
cd ~/djob

# Copiar template
cp .env.production.example .env

# Gerar senhas seguras
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 64)"

# Editar o .env com as senhas geradas
nano .env
```

O `.env` deve ficar assim (exemplo):

```env
POSTGRES_USER=djob
POSTGRES_PASSWORD=SUA_SENHA_GERADA_AQUI
POSTGRES_DB=djob_prod
NODE_ENV=production
PORT=3001
JWT_SECRET=SEU_JWT_SECRET_GERADO_AQUI
JWT_EXPIRY=7d
CORS_ORIGINS=https://app.djob.com.br
```

> **DICA:** Se ainda não tem domínio configurado, use `CORS_ORIGINS=*` temporariamente
> para testar. Depois troque para o domínio real.

---

### PASSO 7: Build e primeiro deploy

```bash
cd ~/djob

# Build da imagem da API (pode demorar 3-5 min na primeira vez)
docker compose build api

# Subir o banco de dados primeiro
docker compose up -d db

# Aguardar o banco estar saudável (10-15 segundos)
sleep 15
docker compose ps  # db deve estar "healthy"

# Rodar migrations do Prisma
docker compose --profile migrate run --rm migrate

# Subir a API e o Nginx
docker compose up -d

# Verificar se tudo está rodando
docker compose ps
```

Saída esperada do `docker compose ps`:

```
NAME         SERVICE   STATUS          PORTS
djob-api-1   api       Up (healthy)    127.0.0.1:3001->3001/tcp
djob-db-1    db        Up (healthy)    127.0.0.1:5432->5432/tcp
djob-nginx-1 nginx     Up (healthy)    0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

**Testar localmente no servidor:**

```bash
curl http://localhost:3001/api
curl http://localhost/api
```

**Testar externamente (do seu Mac):**

```bash
curl http://SEU_IP_PUBLICO/api
```

Se retornar resposta JSON, a API está no ar!

---

### PASSO 8: Configurar domínio (DNS)

No seu provedor de DNS (Cloudflare, Registro.br, GoDaddy, etc.):

| Tipo | Nome              | Valor            | TTL |
| ---- | ----------------- | ---------------- | --- |
| A    | `api.djob.com.br` | `SEU_IP_PUBLICO` | 300 |

Aguarde a propagação (5-30 minutos) e teste:

```bash
# Do seu Mac
curl http://api.djob.com.br/api
```

---

### PASSO 9: Gerar certificado SSL (Let's Encrypt)

Após o DNS estar propagado e `http://api.djob.com.br` funcionar:

```bash
cd ~/djob

# Gerar certificado via certbot (no container)
docker compose --profile certbot run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d api.djob.com.br \
  --email seu@email.com \
  --agree-tos \
  --no-eff-email
```

Se o certificado foi gerado com sucesso, ativar SSL no Nginx:

```bash
# Editar a config do Nginx para ativar SSL
nano infra/nginx/nginx.conf
```

**No arquivo, faça 3 alterações:**

1. **Comentar** o bloco `location /` dentro do server HTTP (que faz proxy)
2. **Descomentar** o `return 301 https://...` no server HTTP
3. **Descomentar** todo o bloco `server` HTTPS (port 443)

Depois, reiniciar o Nginx:

```bash
docker compose restart nginx

# Testar HTTPS
curl https://api.djob.com.br/api
```

**Renovação automática (cron):**

```bash
# Adicionar ao crontab
(crontab -l 2>/dev/null; echo "0 3 1,15 * * cd ~/djob && docker compose --profile certbot run --rm certbot renew && docker compose restart nginx") | crontab -
```

---

### PASSO 10: Configurar backup automático do banco

```bash
# Criar diretório de backups
mkdir -p ~/backups

# Adicionar backup diário ao cron (todo dia às 2h da manhã)
(crontab -l 2>/dev/null; echo "0 2 * * * cd ~/djob && docker compose exec -T db pg_dump -U djob djob_prod | gzip > ~/backups/djob_\$(date +\%Y\%m\%d_\%H\%M).sql.gz && find ~/backups -mtime +30 -delete") | crontab -

# Verificar crontab
crontab -l
```

---

### Comandos úteis do dia a dia

```bash
# Ver logs da API em tempo real
docker compose logs -f api

# Ver logs do banco
docker compose logs -f db

# Reiniciar tudo
docker compose restart

# Atualizar (após git pull ou nova imagem)
cd ~/djob && git pull
docker compose build api
docker compose --profile migrate run --rm migrate
docker compose up -d

# Ver uso de recursos
docker stats

# Backup manual
docker compose exec -T db pg_dump -U djob djob_prod | gzip > ~/backups/manual_$(date +%Y%m%d).sql.gz

# Restaurar backup
gunzip < ~/backups/djob_20260715.sql.gz | docker compose exec -T db psql -U djob djob_prod
```

---

## Desenvolvimento local com banco de produção

O ambiente local usa o PostgreSQL da Oracle por meio de um túnel SSH. A porta
do banco continua inacessível pela internet e a aplicação local lê e grava no
mesmo banco utilizado pela API de produção.

### Iniciar o ambiente

Inicie a aplicação normalmente:

```bash
npm run dev
```

O comando abre automaticamente o túnel SSH, inicia os serviços de
desenvolvimento e encerra o túnel ao finalizar com `Ctrl+C`. Caso já exista um
túnel ativo em `localhost:5433`, ele é reutilizado e permanece aberto.

O arquivo `.env` local deve apontar `DATABASE_URL` para `localhost:5433`. Não
altere a porta exposta do PostgreSQL na Oracle e não versione o arquivo `.env`.

### Criar e aplicar migrations

O banco de produção foi reconciliado com as migrations já existentes. A partir
de agora, use os comandos abaixo. Nunca execute `prisma migrate dev`, `prisma
db push` ou `prisma migrate reset` com a `DATABASE_URL` de produção.

```bash
# 1. Altere packages/database/prisma/schema.prisma.

# 2. Com o túnel ativo, gere o SQL da migration sem aplicá-la.
npm run db:migrate:create -- add_nome_descritivo

# 3. Revise o arquivo SQL criado em packages/database/prisma/migrations/.

# 4. Aplique as migrations pendentes no banco de produção.
npm run db:migrate

# 5. Confirme o estado do histórico.
npm run db:migrate:status
```

O comando `db:migrate:create` compara o schema Prisma com o banco de produção
e cria somente o SQL necessário. Para alterações com dados existentes, revise
o SQL cuidadosamente, faça backup e acrescente a transformação de dados à
migration antes de aplicá-la.

### Recuperação de senha por e-mail

O fluxo de recuperação de senha exige um provedor de e-mail antes de ser
ativado para usuários finais. A API possui tokens de uso único e as telas de
recuperação, mas responde que o serviço está indisponível até haver um adaptador
de entrega configurado.

Ao escolher o provedor, configure estas variáveis no `.env` da Oracle e
reinicie a API:

```bash
APP_WEB_URL=https://app.djob.com.br
PASSWORD_RESET_TOKEN_TTL_MINUTES=60
MAIL_PROVIDER=
MAIL_FROM=
```

Não registre links ou tokens de recuperação em logs, commits ou ferramentas de
observabilidade.

---

## PARTE 2: Vercel (Frontend)

### PASSO 1: Preparar o repositório

Certifique-se de que o código está no GitHub (público ou privado).

### PASSO 2: Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub

2. Clique em **"Add New..." → "Project"**

3. Selecione o repositório **sistema-djob**

4. Configure:

   | Campo            | Valor                                          |
   | ---------------- | ---------------------------------------------- |
   | Framework Preset | **Next.js**                                    |
   | Root Directory   | **`apps/web`**                                 |
   | Build Command    | `cd ../.. && npx turbo run build --filter=web` |
   | Output Directory | `.next`                                        |
   | Install Command  | `cd ../.. && npm install`                      |

5. Em **Environment Variables**, adicione:

   | Variável              | Valor                     |
   | --------------------- | ------------------------- |
   | `NEXT_PUBLIC_API_URL` | `https://api.djob.com.br` |

6. Clique em **"Deploy"**

> A primeira build pode demorar 2-4 minutos. Builds seguintes são mais rápidas (~1 min).

### PASSO 3: Configurar domínio customizado

1. No dashboard do projeto Vercel, vá em **Settings → Domains**

2. Adicione: `app.djob.com.br`

3. A Vercel mostrará as configurações de DNS necessárias. No seu provedor:

   | Tipo  | Nome  | Valor                  |
   | ----- | ----- | ---------------------- |
   | CNAME | `app` | `cname.vercel-dns.com` |

4. Aguarde propagação e a Vercel gera o SSL automaticamente

### PASSO 4: Deploy automático

A partir de agora, cada `git push` para `main` faz deploy automático:

- Push para `main` → deploy de produção
- Pull Request → deploy de preview (URL temporária)

---

## Resumo dos domínios DNS

| Tipo  | Nome              | Destino                 |
| ----- | ----------------- | ----------------------- |
| A     | `api.djob.com.br` | IP público da VM Oracle |
| CNAME | `app.djob.com.br` | `cname.vercel-dns.com`  |

---

## Checklist de Primeiro Deploy

### Oracle Cloud

- [ ] VM criada (Ampere A1, Ubuntu, 4 OCPU, 24 GB)
- [ ] Portas 80 e 443 abertas na Security List
- [ ] SSH funcionando
- [ ] Docker e Docker Compose instalados
- [ ] iptables liberado para 80/443
- [ ] Repositório clonado em `~/djob`
- [ ] `.env` preenchido com senhas fortes
- [ ] `docker compose up -d` rodando sem erros
- [ ] Migrations executadas
- [ ] `curl http://SEU_IP/api` retorna resposta
- [ ] DNS `api.djob.com.br` apontando para o IP
- [ ] Certificado SSL gerado (Let's Encrypt)
- [ ] `curl https://api.djob.com.br/api` funciona
- [ ] Backup automático configurado no cron

### Vercel

- [ ] Repositório conectado na Vercel
- [ ] `NEXT_PUBLIC_API_URL` configurado
- [ ] Build passando com sucesso
- [ ] DNS `app.djob.com.br` configurado (CNAME)
- [ ] Site acessível em `https://app.djob.com.br`

### GitHub (opcional, para deploy automático da API)

- [ ] Secret `ORACLE_HOST` = IP da VM
- [ ] Secret `ORACLE_USER` = `ubuntu`
- [ ] Secret `ORACLE_SSH_KEY` = chave privada SSH
