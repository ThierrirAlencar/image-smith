# Etapa 1: Construir a imagem da aplicação Node.js
FROM node:18 AS node-stage

# Definir o diretório de trabalho
WORKDIR /api/

# Copiar apenas os arquivos de dependências para aproveitar o cache
COPY package*.json . 
# Enforce a copia do arquivo build.sh
COPY build.sh ./build.sh
RUN chmod +x ./build.sh

# Copiar o restante do código para o diretório de trabalho
COPY . .

# Expor a porta que será utilizada pela aplicação Node.js
EXPOSE 5636

# Criar um ambiente virtual para Python e instalar as dependências (utilizando o build.sh)
RUN bash ./build.sh

# Definir o comando de execução da aplicação em produção (substituir 'dev' por 'start')
CMD ["npm", "run", "start"]