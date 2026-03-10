"use server";

import { stripe } from "@/server/payments";
import { db } from "@/db";
import { plan as $package } from "@/db/schema/package";
import { intent as $intent } from "@/db/schema/intent";
import { purchase as $purchase } from "@/db/schema/purchase";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { prices } from "@/mock/prices";
import { eq } from "drizzle-orm";

type CreateProductIntentInput = {
  variant: "digital" | "printed";
  product: "capsule" | "letter";
  quantity: number;
};

export async function createProductIntent({ variant, product, quantity }: CreateProductIntentInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (quantity < 1) return { error: "Quantity cannot be less than 1" };

  const price = prices[product][variant].currency;
  const amount = price * quantity;

  const { client_secret, id } = await stripe.paymentIntents.create({
    currency: "USD",
    amount,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (!client_secret) return { error: "No client secret was returned" };

  const [intent] = await db
    .insert($intent)
    .values({
      PID: id,
      price,
      amount,
      reason: product,
      user: session?.user.id,
    })
    .returning({ id: $intent.id });

  return { client_secret, intent: { id: intent.id } };
}

type CreatePackageIntentInput = {
  packageID: number;
};

export async function createPackageIntent({ packageID }: CreatePackageIntentInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: "Unathorized" };

  const [pkg] = await db.select().from($package).where(eq($package.id, packageID));

  if (!pkg) return { error: "Package not found" };

  const { client_secret, id } = await stripe.paymentIntents.create({
    currency: "USD",
    amount: pkg.price,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (!client_secret) return { error: "No client secret was returned" };

  const [intent] = await db
    .insert($intent)
    .values({
      PID: id,
      price: pkg.price,
      amount: pkg.price,
      reason: "package",
      user: session?.user.id,
    })
    .returning({ id: $intent.id });

  await db.insert($purchase).values({
    user: session.user.id,
    intent: intent.id,
    package: pkg.id,
  });

  return { client_secret, intent: { id: intent.id } };
}

type UpdatePackageIntentInput = {
  packageID: number;
  intentID: number;
};

export async function updatePackageIntent({ packageID, intentID }: UpdatePackageIntentInput) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return { error: "Unathorized" };

  const [pkg] = await db.select().from($package).where(eq($package.id, packageID));
  const [intent] = await db.select().from($intent).where(eq($intent.id, intentID));

  if (!pkg) return { error: "Package not found" };
  if (!intent) return { error: "Intent not found" };

  await stripe.paymentIntents.update(intent.PID, { amount: pkg.price });
  await db.update($intent).set({ amount: pkg.price }).returning({ id: $intent.id });

  return {};
}
