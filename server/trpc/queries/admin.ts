import { adminProcedure } from "../trpc";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import z from "zod";

const usersInput = z.object({
  limit: z.number(),
  offset: z.number(),
});

export const users = adminProcedure.input(usersInput).query(async ({ ctx, input }) => {
  const { limit, offset } = input;

  return await auth.api.listUsers({
    headers: await headers(),
    query: {
      limit,
      offset,
    },
  });
});
