FROM node:16.15-bullseye-slim

RUN apt update && apt install -y protobuf-compiler

WORKDIR /app

COPY ./package.json ./yarn.lock /app/
RUN yarn install
