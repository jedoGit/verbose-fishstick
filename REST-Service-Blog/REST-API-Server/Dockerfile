FROM node:20.5.1-alpine

RUN mkdir -p /home/node/app/server/node_modules && chown -R node:node /home/node/app/server

WORKDIR /home/node/app/server

COPY package.json /home/node/app/server

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8081

CMD [ "npm", "start"]