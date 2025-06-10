#!/bin/bash

echo "🔍 Verificando instalação do Python..."

# Verifica se python3 está instalado
if ! command -v python3 &> /dev/null
then
    echo "⚠️  Python3 não encontrado. Tentando instalar..."
    
    # Para ambientes baseados em Debian/Ubuntu
    if [ -f /etc/debian_version ]; then
        sudo apt update
        sudo apt install -y python3 python3-venv python3-full
    else
        echo "❌ Python não encontrado e instalação automática não suportada neste sistema."
        exit 1
    fi
else
    echo "✅ Python3 encontrado."
fi

# Verificando se pip está instalado
if ! python3 -m pip --version &> /dev/null; then
    echo "⚠️  pip não encontrado. Instalando pip..."

    curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    sudo python3 get-pip.py
    rm get-pip.py
else
    echo "✅ pip já está instalado."
fi

# Criar ambiente virtual Python
echo "🐍 Criando ambiente virtual Python..."
python3 -m venv venv

# Ativar virtualenv
echo "📦 Ativando ambiente virtual..."
source venv/bin/activate

# Garantir que pip está atualizado dentro do venv
pip install --upgrade pip

# Instalar dependências Python dentro do venv
echo "📦 Instalando dependências do Python..."
pip install -r public/requirements.txt

# Salva caminho absoluto do Python do venv
VENV_PYTHON="$(pwd)/venv/bin/python"
echo "✅ Caminho do Python do venv: $VENV_PYTHON"

# Exporta variável para uso posterior (ex: chamada via Node)
echo "export VENV_PYTHON=$VENV_PYTHON" >> .venv_env_vars

# Instalar dependências do Node.js
echo "📦 Instalando dependências do Node.js..."
npm install --force

echo "✅ Build finalizado com sucesso."
