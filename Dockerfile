# Definimos una imagen base
FROM node:20
# Creamos una carpeda donde vamos a guardar el proyecto
WORKDIR /app

# Copiar los packages de nuestra carpeta local a la carpeta de operaciones
COPY package*.json ./

# Corremos el comando para instalar dependencias
RUN npm install

COPY .env.production .env.production

# Tomamos el codido del applicatico
COPY . .

# Habiltar un puerto que escuche nuestra computadora
EXPOSE 8080

CMD ["npm","run","start"]