FROM node:16-alpine

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install
COPY . /usr/src/bot

ENTRYPOINT node bin/www --host=$DB_HOST --port=$DB_PORT --user=$DB_USER --password="$DB_PASSWORD" --database=$DB_NAME --sslkey="$HTTP_TLS_KEY" --sslcert="$HTTP_TLS_CERT"