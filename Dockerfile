FROM node:16-alpine

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install
COPY . /usr/src/bot

EXPOSE 8081

ENTRYPOINT node bin/www