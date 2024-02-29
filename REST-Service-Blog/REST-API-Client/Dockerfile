FROM node:20.11.1-alpine

RUN mkdir -p /home/node/app/client/node_modules && chown -R node:node /home/node/app/client

WORKDIR /home/node/app/client

COPY package*.json /home/node/app/client

USER node

RUN npm ci

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "npm", "start"]