import { protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/db";
import { balance as $balance } from "@/db/schema/balance";
import { eq } from "drizzle-orm";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { UserWithBalance } from "@/types";
import { cache } from "react";

export const getUser = cache(async (): Promise<UserWithBalance | null> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return null;

  const [balance] = await db.select().from($balance).where(eq($balance.user, session.user.id));

  return { ...session.user, balance };
});

export const user = publicProcedure.query<UserWithBalance | null>(async () => {
  return await getUser();
});

export const session = protectedProcedure.query(({ ctx }) => {
  return ctx.session.session;
});
