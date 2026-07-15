#!/bin/bash
set -euo pipefail

# ============================================
# D.job System — Server Setup Script
# Para Oracle Cloud Free Tier (Ubuntu 22.04+ ARM/AMD)
# ============================================

echo "=========================================="
echo "  D.job System — Setup do Servidor"
echo "=========================================="

# 1. Atualizar sistema
echo "[1/6] Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar Docker
echo "[2/6] Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
    echo "Docker instalado. Você precisará reconectar (logout/login) para usar sem sudo."
else
    echo "Docker já instalado: $(docker --version)"
fi

# 3. Instalar Docker Compose plugin
echo "[3/6] Verificando Docker Compose..."
if docker compose version &> /dev/null; then
    echo "Docker Compose já instalado: $(docker compose version)"
else
    sudo apt install -y docker-compose-plugin
fi

# 4. Criar estrutura de diretórios
echo "[4/6] Criando estrutura de diretórios..."
mkdir -p ~/djob
mkdir -p ~/backups

# 5. Configurar firewall (iptables — OCI usa isso)
echo "[5/6] Configurando firewall local..."
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT 2>/dev/null || true
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT 2>/dev/null || true
sudo netfilter-persistent save 2>/dev/null || true

# 6. Configurar swap (recomendado para Free Tier)
echo "[6/6] Configurando swap..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap de 2GB criado."
else
    echo "Swap já existe."
fi

echo ""
echo "=========================================="
echo "  Setup concluído!"
echo "=========================================="
echo ""
echo "PRÓXIMOS PASSOS:"
echo "  1. Faça logout e login novamente (para Docker funcionar sem sudo)"
echo "  2. Clone o repositório: git clone <URL> ~/djob"
echo "  3. Copie o .env: cp .env.production.example .env"
echo "  4. Edite o .env: nano .env"
echo "  5. Suba os serviços: cd ~/djob && docker compose up -d"
echo ""
