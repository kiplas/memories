import { publicProcedure } from "../trpc";

export const ping = publicProcedure.query(() => {
  return "pong";
});
