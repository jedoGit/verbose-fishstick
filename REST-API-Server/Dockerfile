FROM node:20.11.1-alpine

RUN mkdir -p /home/node/app/server/node_modules && chown -R node:node /home/node/app/server

WORKDIR /home/node/app/server

COPY package*.json /home/node/app/server

USER node

RUN npm ci

COPY --chown=node:node . .

RUN mkdir -p /home/node/app/server/images && chown -R node:node /home/node/app/server/images

EXPOSE 8081

CMD [ "npm", "start"]