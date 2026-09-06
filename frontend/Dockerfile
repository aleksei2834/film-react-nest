FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM alpine:3.20
WORKDIR /dist
COPY --from=build /app/dist ./
CMD ["sh", "-c", "cp -r /dist/* /usr/share/nginx/html/ && tail -f /dev/null"]