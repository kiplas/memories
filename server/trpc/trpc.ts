import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "../auth";
import { headers } from "next/headers";
import superjson from "superjson";

const t = initTRPC.create({ transformer: superjson });

export const createRouter = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ next }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new TRPCError({ code: "UNAUTHORIZED" });

  const context = { session };

  return next({ ctx: context });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  const { session } = ctx;

  if (!session.user.role?.includes("admin")) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});
