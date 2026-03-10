import z from "zod";
import { upload } from "./upload";
import { illustration } from "./illustration";

export const capsule = z.object({
  illustration,
  message: z.nullable(z.string()),
  uploads: z.array(z.object({ upload })),
});
