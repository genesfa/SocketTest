FROM node:12.16.1-alpine as build-step
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD node app.js
