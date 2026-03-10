FROM node:20-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm && pnpm i --frozen-lockfile


FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build


FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN mkdir uploads
RUN chown nextjs:nodejs .next
RUN chown nextjs:nodejs uploads

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD node server.js