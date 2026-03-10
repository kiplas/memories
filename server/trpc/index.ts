import { createRouter } from "./trpc";
import { ping } from "./queries/ping";
import { session, user } from "./queries/session";
import { users } from "./queries/admin";
import { capsules, letters, capsuleCount, letterCount } from "./queries/orders";
import { forProduct } from "./queries/price";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { getQueryClient } from "@/lib/query";
import { cache } from "react";

export const router = createRouter({
  admin: createRouter({
    users,
  }),

  session: createRouter({
    session,
    user,
    capsules,
    letters,

    count: createRouter({
      letters: letterCount,
      capsules: capsuleCount,
    }),
  }),

  prices: forProduct,

  ping,
});

export type Router = typeof router;

export const trpc = createTRPCOptionsProxy({
  ctx: {},
  router,
  queryClient: getQueryClient(),
});

export const getCaller = cache(() => router.createCaller({}));
