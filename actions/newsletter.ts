"use server";

import type { APIOutput } from "@/types";
import { subscriber as $subscriber } from "@/db/schema/newsletter";
import z from "zod";
import { db } from "@/db";

type SubscribeInput = {
  email: string;
};

export async function subscribe({ email }: SubscribeInput): Promise<APIOutput> {
  const parsedEmail = z.email().safeParse(email);

  if (parsedEmail.error) return { success: false, error: "Invalid email" };

  const existing = await db.query.subscriber.findFirst({
    where: ($subscriber, { eq }) => eq($subscriber.email, email),
  });

  if (existing) return { success: true };

  await db.insert($subscriber).values({ email });

  return { success: true };
}
