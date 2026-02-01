FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json ./package.json

COPY pnpm-lock.yaml ./pnpm-lock.yaml

COPY turbo.json ./turbo.json

COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./packages ./packages

COPY ./apps/ws-backend/package.json ./apps/ws-backend/package.json

COPY ./apps/ws-backend/tsconfig.json ./apps/ws-backend/tsconfig.json

COPY ./apps/ws-backend/src ./apps/ws-backend/src

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run generate:db

RUN pnpm build

EXPOSE 8081

CMD ["pnpm" , "start"]


