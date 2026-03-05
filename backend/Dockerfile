FROM node:20-alpine AS builder
RUN npm i -g npm@11.11.0
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS production
RUN npm i -g npm@11.11.0
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci && npm prune --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "dist/main.js"]