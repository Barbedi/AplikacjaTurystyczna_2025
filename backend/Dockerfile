FROM node:23.9.0-alpine3.21 AS builder
RUN apk add --no-cache tzdata

WORKDIR /backend
COPY package*.json ./
RUN npm ci --omit-dev
COPY . .
RUN npm run build