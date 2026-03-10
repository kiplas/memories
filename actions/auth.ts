"use server";

import type { UserWithBalance, APIOutput } from "@/types";
import { auth } from "@/server/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { balance as $balance } from "@/db/schema/balance";
import { eq } from "drizzle-orm";
import { redis } from "@/server/redis";
import { sendEmailVerification } from "@/server/mail";
import crypto from "crypto";
import z from "zod";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type SendRecoveryOTPInput = {
  email: string;
};

export async function sendRecoveryOTP({ email }: SendRecoveryOTPInput): Promise<APIOutput> {
  const parsedEmail = z.email().safeParse(email);

  if (parsedEmail.error) return { success: false, error: "Invalid email" };

  const user = await db.query.user.findFirst({ where: ($user, { eq }) => eq($user.email, email) });

  if (!user) return { success: false, error: "User does not exist" };

  try {
    await auth.api.sendVerificationOTP({ body: { email: parsedEmail.data, type: 'forget-password' } });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) return { success: false, error: error.message };

    return { success: false, error: "Uknown" };
  }
}

type VerifyRecoveryOTPInput = {
  email: string;
  otp: string;
};

export async function verifyRecoveryOTP(input: VerifyRecoveryOTPInput): Promise<APIOutput> {
  const parsedInput = z.object({ email: z.email(), otp: z.string() }).safeParse(input);

  if (parsedInput.error) return { success: false, error: parsedInput.error.message };

  try {
    await auth.api.checkVerificationOTP({
      body: {
        email: parsedInput.data.email,
        type: "forget-password",
        otp: parsedInput.data.otp,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) return { success: false, error: error.message };

    return { success: false, error: "Uknown" };
  }
}

type UpdatePasswordOTPInput = {
  email: string;
  otp: string;
  password: string;
};

export async function updatePassword(input: UpdatePasswordOTPInput): Promise<APIOutput> {
  const parsedInput = z.object({ email: z.email(), otp: z.string(), password: z.string() }).safeParse(input);

  if (parsedInput.error) return { error: parsedInput.error.message, success: false };

  try {
    await auth.api.resetPasswordEmailOTP({
      body: {
        email: parsedInput.data.email,
        otp: parsedInput.data.otp,
        password: parsedInput.data.password,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) return { success: false, error: error.message };
  }

  return { success: true };
}

type SendVerificationOTPInput = {
  email: string;
};

type SendVerificationOTPOutput = {
  error?: string;
  success: boolean;
};

export async function sendVerificationOTP({ email }: SendVerificationOTPInput): Promise<SendVerificationOTPOutput> {
  const parsedEmail = z.email().safeParse(email);

  if (parsedEmail.error) return { success: false, error: "Invalid email" };

  const user = await db.query.user.findFirst({ where: ($user, { eq }) => eq($user.email, email) });

  if (user) return { success: false, error: "User already exists" };

  const otp = generateOTP();

  await redis.set(`signup-otp:${email}`, otp, "EX", 300);

  const result = await sendEmailVerification({ email, otp });

  if (result?.error) return { success: false, error: result.error };

  return { success: true };
}

type VerifyOTPInput = {
  email: string;
  otp: string;
};

export async function verifyOTP(input: VerifyOTPInput) {
  const parsedInput = z.object({ email: z.email(), otp: z.string() }).safeParse(input);

  if (parsedInput.error) return { error: parsedInput.error.message };

  const key = `signup-otp:${input.email}`;
  const cached = await redis.get(key);

  if (!cached || cached !== parsedInput.data.otp) return { success: false, error: "Invalid" };

  const token = crypto.randomBytes(32).toString("hex");

  await redis.del(key);
  await redis.set(`signup-token:${parsedInput.data.email}`, token, "EX", 600);

  return { success: true, token };
}

type SignupInput = {
  name: string;
  email: string;
  password: string;
  token: string;
};

type SignupReturn = { error: string; success: false; user?: never } | { error?: never; success: true; user: UserWithBalance };

export async function signup(input: SignupInput): Promise<SignupReturn> {
  const parsedInput = z.object({ email: z.email(), name: z.string(), token: z.string(), password: z.string() }).safeParse(input);

  if (parsedInput.error) return { success: false, error: parsedInput.error.message };

  const key = `signup-token:${parsedInput.data.email}`;

  const cached = await redis.get(key);

  if (!cached || cached !== parsedInput.data.token) return { success: false, error: "Token is invalid" };

  try {
    const response = await auth.api.signUpEmail({ body: parsedInput.data });
    const [balance] = await db.select().from($balance).where(eq($balance.user, response.user.id));
    await redis.del(key);
    return { success: true, user: { ...response.user, balance } };
  } catch (error) {
    if (error instanceof APIError) return { error: error.message, success: false };
  }

  return { error: "unkown", success: false };
}

type SigninProps = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type SigninReturn = { error: string; success: false; user?: never } | { error?: never; success: true; user: UserWithBalance };

export async function signin({ email, password, rememberMe }: SigninProps): Promise<SigninReturn> {
  try {
    const response = await auth.api.signInEmail({ body: { email, password, rememberMe } });
    const [balance] = await db.select().from($balance).where(eq($balance.user, response.user.id));
    return { user: { ...response.user, balance }, success: true };
  } catch (error) {
    if (error instanceof APIError) return { error: error.message, success: false };
  }

  return { error: "unknown", success: false };
}

export async function signout() {
  await auth.api.signOut({ headers: await headers() });

  return true;
}
