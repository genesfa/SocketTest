# This defines our starting point
#FROM node:8
#RUN mkdir /usr/src/app
#
#WORKDIR /usr/src/app
#RUN npm install -g @angular/cli
#COPY src/app .

#FROM node
#
#RUN mkdir /usr/src/app
#WORKDIR /usr/src/app
#RUN npm install -g @angular/cli
#
#COPY . /usr/src/app
#
#CMD ng serve --host 0.0.0.0 --port 4500

FROM node:12.16.1-alpine as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4200
CMD npm run start
