FROM node:24.1.0-alpine AS builder

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .