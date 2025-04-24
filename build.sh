#!/bin/bash

echo "🔍 Verificando instalação do Python..."

# Verifica se python3 está instalado
if ! command -v python3 &> /dev/null
then
    echo "⚠️  Python3 não encontrado. Tentando instalar..."
    
    # Para ambientes baseados em Debian/Ubuntu
    if [ -f /etc/debian_version ]; then
        sudo apt update
        sudo apt install -y python3
    else
        echo "❌ Python não encontrado e instalação automática não suportada neste sistema."
        exit 1
    fi
else
    echo "✅ Python3 encontrado."
fi

# Verificando se pip está instalado
if ! python3 -m pip &> /dev/null; then
    echo "⚠️  pip não encontrado. Instalando pip..."

    # Instala o pip manualmente
    curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    sudo python3 get-pip.py
    rm get-pip.py
else
    echo "✅ pip já está instalado."
fi

# Instalando dependências Python
echo "📦 Instalando dependências do Python..."
python3 -m pip install -r public/requirements.txt

# Executando build do NestJS
echo "⚙️  Compilando projeto NestJS..."
npm run start
