# container to build application
FROM node:lts-alpine as builder

WORKDIR /usr/src/app

# for caching
COPY ./app/package*.json /usr/src/app/
RUN npm install

# install vue for building the acutal app
RUN npm install @vue/cli

# build
COPY ./app /usr/src/app/
RUN npm run build

## nginx
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf


EXPOSE 80
