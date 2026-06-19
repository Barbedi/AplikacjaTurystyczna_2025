FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

FROM base AS dev

COPY . .

EXPOSE 6868

CMD ["npm", "run", "dev"]

FROM base AS build

COPY . .

RUN npm run build

FROM node:18-alpine AS prod

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data

EXPOSE 6868

CMD ["node", "dist/index.js"]
