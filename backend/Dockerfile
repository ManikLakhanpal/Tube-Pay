FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk add --no-cache netcat-openbsd
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json .

EXPOSE 5000
CMD ["npm", "run", "start"]