FROM node:23-alpine AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Install dependencies
FROM base AS deps

# https://github.com/nodejs/docker-node/issues/1335#issuecomment-1743914810
RUN yarn config set network-timeout 500000 -g && \
    yarn global add node-gyp

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock .npmrc* ./
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile --prefer-offline

# Rebuild the source code only when needed
FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

COPY --from=builder /app/public ./public

COPY --chown=nextjs:nodejs ./next.config.ts ./next.config.ts

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# node_modules last
COPY --chown=nextjs:nodejs ./package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

SHELL ["/bin/bash", "-c"]

CMD ["yarn", "start"]
# Comment to test ci
