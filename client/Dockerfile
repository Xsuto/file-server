FROM node:16-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT ["node", ".output/server/index.mjs"]
