FROM node:24.1.0-alpine AS base

WORKDIR /workspace/frontend

COPY package*.json ./
RUN npm install

FROM base AS dev

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build

ARG VITE_CLIENT_API_URL
ARG VITE_OPENWEATHER_API_KEY
ARG VITE_WEATHER_CITY

ENV VITE_CLIENT_API_URL=${VITE_CLIENT_API_URL}
ENV VITE_OPENWEATHER_API_KEY=${VITE_OPENWEATHER_API_KEY}
ENV VITE_WEATHER_CITY=${VITE_WEATHER_CITY}

COPY . .

RUN npm run build

FROM nginx:alpine AS prod

COPY --from=build /workspace/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]