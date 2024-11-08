FROM node:20.16.0-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma:generate

RUN pnpm build

EXPOSE 8000

CMD ["pnpm", "start:prod"]
