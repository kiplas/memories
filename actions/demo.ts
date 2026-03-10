"use server";

import type { APIOutput } from "@/types";
import { demoRequest as $demoRequest } from "@/db/schema/demo";
import { db } from "@/db";
import z from "zod";

const $requestSchema = z.object({
  name: z.string(),
  email: z.email(),
  company: z.string(),
  message: z.string(),
});

type RequestSchema = z.infer<typeof $requestSchema>;
type RequestInput = RequestSchema;

export async function request(input: RequestInput): Promise<APIOutput<object, { errors: z.ZodFlattenedError<RequestSchema> }>> {
  const parsedInput = $requestSchema.safeParse(input);

  if (parsedInput.error) return { success: false, error: "Invalid input", errors: z.flattenError(parsedInput.error) };

  await db.insert($demoRequest).values(parsedInput.data);

  return { success: true };
}
