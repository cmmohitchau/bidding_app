FROM node:22-alpine

WORKDIR /usr/src/app

ARG DATABASE_URL

COPY ./package.json ./package.json

COPY ./pnpm-lock.yaml ./pnpm-lock.yaml

COPY ./turbo.json ./turbo.json 

COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml


COPY ./packages ./packages

COPY ./apps/my-app/package.json ./apps/my-app/package.json

COPY ./apps/my-app/tsconfig.json ./apps/my-app/tsconfig.json

COPY ./apps/my-app ./apps/my-app

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm run generate:db

RUN DATABASE_URL=$DATABASE_URL pnpm run build

EXPOSE 3000

CMD ["pnpm" , "start"]