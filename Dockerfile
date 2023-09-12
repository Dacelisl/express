
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY .env.production .env.production
COPY . .
EXPOSE 8080
CMD ["npm","run","start"]