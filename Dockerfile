FROM node:16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -f
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3010
CMD ["nginx", "-g", "daemon off;"]