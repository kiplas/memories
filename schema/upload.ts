import z from "zod";

export const upload = z.object({
  id: z.number(),
  url: z.string(),
});
