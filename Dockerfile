FROM node:14-alpine3.14 as build-deps
WORKDIR /usr/src/app
COPY package.json ./
RUN yarn 
COPY . ./
RUN yarn build

FROM nginx:1.21.6-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]