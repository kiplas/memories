"use server";

import { APIError } from "better-auth";
import { auth } from "@/server/auth";
import { remove, upload } from "@/server/uploads";
import { headers } from "next/headers";
import { user } from "@/db/schema/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function updateImage(blob: Blob) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unathorized");

  const [{ imageUpload }] = await db.select({ imageUpload: user.imageUpload }).from(user).where(eq(user.id, session.user.id));

  if (imageUpload) remove(imageUpload);

  const { id, url } = await upload(blob, { extension: "webp" });

  await db.update(user).set({ image: url, imageUpload: id }).where(eq(user.id, session.user.id));

  return { url };
}

export async function updateName(name: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unathorized");

  await auth.api.updateUser({ headers: await headers(), body: { name } });
}

export async function updateEmail(email: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unathorized");

  await auth.api.changeEmail({ headers: await headers(), body: { newEmail: email } });
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unathorized");

  try {
    await auth.api.changePassword({ headers: await headers(), body: { newPassword, currentPassword } });
  } catch (error) {
    if (error instanceof APIError) return { error: error.message, status: error.status, success: false };
  }

  return { success: true };
}
