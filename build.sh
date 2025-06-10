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

# Criar e ativar ambiente virtual
echo "🐍 Criando ambiente virtual Python..."
python3 -m venv venv
source venv/bin/activate

# Instalando dependências Python no venv
echo "📦 Instalando dependências do Python..."
pip install -r public/requirements.txt

echo "📦 Lista de dependencias instaladas com sucesso"
pip list 

echo "📦 Lista de dependencias instaladas com sucesso dentro da venv"
venv/bin/pip list 

echo "instalando dependencias NPM"
npm install --force
