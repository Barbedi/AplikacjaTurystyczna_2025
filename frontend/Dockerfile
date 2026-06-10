FROM node:24.1.0-alpine

WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm run build && npx vite preview --host 0.0.0.0 --port 3000"]