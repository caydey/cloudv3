# container to build application
FROM node:lts-alpine as builder

WORKDIR /usr/src/app

# for caching
COPY ./app/package*.json /usr/src/app/
RUN npm ci

COPY ./app /usr/src/app

RUN npm run build

### Server ###
FROM node:lts-alpine

WORKDIR /usr/src/app

ENV NODE_ENV production

# copy build project
COPY --from=builder /usr/src/app/dist /usr/src/app/

# install dependencies (node_modules)
COPY --from=builder /usr/src/app/package*.json /usr/src/app/
RUN npm ci --omit=dev

# api port
EXPOSE 3000

CMD ["node", "server.js"]
