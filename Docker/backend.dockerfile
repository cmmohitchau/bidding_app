FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json ./package.json

COPY pnpm-lock.yaml ./pnpm-lock.yaml

COPY turbo.json ./turbo.json

COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./packages ./packages

COPY ./apps/http-backend/package.json ./apps/http-backend/package.json

COPY ./apps/http-backend/tsconfig.json ./apps/http-backend/tsconfig.json

COPY ./apps/http-backend/src ./apps/http-backend/src

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run generate:db

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm" , "start:backend"]