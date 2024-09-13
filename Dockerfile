FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install

COPY . /app/

RUN pnpm build