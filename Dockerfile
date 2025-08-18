FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.14.2 --activate

FROM base AS build
COPY . /j8ke
WORKDIR /j8ke
RUN pnpm install
RUN pnpm build:server

ENV NODE_ENV=production

EXPOSE 3000
CMD ["pnpm", "start:server"]