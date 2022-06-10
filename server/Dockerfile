FROM node:lts-alpine

WORKDIR /usr/src/app

ENV NODE_ENV production

# caching
COPY ./app/package*.json ./
RUN npm ci --omit=dev

# copy project
COPY ./app /usr/src/app

# api port
EXPOSE 3000

# permissions are lowered in docker-compose
CMD ["node", "server.js"]
