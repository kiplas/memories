import z from "zod";
import { upload } from "./upload";

export const illustration = z.object({
  id: z.number(),
  label: z.string(),
  upload,
});
