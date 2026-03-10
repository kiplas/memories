# Structure

- client
- server
- db
- components
- icons
- public
- state

React Query

## Dev

pnpm dev
pnpm stripe

# Shadcn

# Redis
# Drizzle
# Better Auth
# tRPC

Use tRPC with TanStack Query for queries and server functions for mutations.

Sending logic is located in three places:

1. in /actions/order if user paid with credits and delivery is instant
2. in /app/(server)/payment/webhooks if user paid with fiat and delivery is instant
3. in scheduled handler is delivery is scheduled

## Auth workflow

1. Verification code
2. Registration code
3. Success

## Session on the client

Managed by the tanstack query. Prefetched in a root server component.
On sign in tanstack query is populated on the client. Same for sign out, it is invalidated on the client after server confirmed session invalidation.