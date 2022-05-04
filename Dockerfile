FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8081

ENTRYPOINT node bin/www