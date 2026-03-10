import z from "zod";
import { illustration } from "./illustration";

export const letter = z.object({
  illustration,
  message: z.nullable(z.string()),
});
