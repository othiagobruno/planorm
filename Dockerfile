FROM node:14-alpine as builder

RUN apk add --no-cache git

WORKDIR /home/node/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

COPY .env.production ./build/.env

RUN cd ./build && yarn install --production

EXPOSE 3333

CMD ["node", "./build/server.js"]