FROM node:20-alpine AS build-step
WORKDIR /app

COPY laboratorycolor.web/package*.json ./laboratorycolor.web/
WORKDIR /app/laboratorycolor.web
RUN npm install

COPY laboratorycolor.web/ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-step /app/laboratorycolor.web/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]