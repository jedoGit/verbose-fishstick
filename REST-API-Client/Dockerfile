# Setup the web-app image
# Pull from official node base image
FROM node:20.11.1-alpine as web-build

# Setup the work dir for the web-app
RUN mkdir -p /home/node/app/client/node_modules && chown -R node:node /home/node/app/client

WORKDIR /home/node/app/client

# We only want to copy the package*.json files
# In case there's already a node_modules folder, we don't want to copy that
# to the work directory
COPY package*.json /home/node/app/client

USER node

# Build the web-application
# npm ci cleans first then install
RUN npm ci

COPY --chown=node:node . .

RUN  npm run build --prod

# Second stage 
FROM nginx:latest

RUN mkdir -p /etc/nginx/ssl
COPY /Certificate/* /etc/nginx/ssl/

COPY --from=web-build /home/node/app/client/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# Start the nginx server
# CMD [ "npm", "start"]
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
