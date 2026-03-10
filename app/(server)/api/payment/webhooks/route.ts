import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/server/payments";
import { db } from "@/db";
import { intent as $intent } from "@/db/schema/intent";
import { ledger as $ledger } from "@/db/schema/ledger";
import { purchase as $purchase } from "@/db/schema/purchase";
import { balance as $balance } from "@/db/schema/balance";
import { capitalize } from "@/lib/strings";
import { eq, sql } from "drizzle-orm";
import { notifyCapsuleAddressee, notifyLetterAddressee, notifySender, sendPackageReceipt } from "@/server/mail";
import { digitalAddressee as $digitalAddressee } from "@/schema/addressee";
import z from "zod";
import { isAfter } from "date-fns";
import { formatDate } from "@/lib/date";

function constructMethod(details: Stripe.Charge.PaymentMethodDetails | null) {
  if (!details) return "Undefined";

  switch (details.type) {
    case "card": {
      const network = details.card?.network;
      const digits = details.card?.last4;

      if (!network || !digits) return "Card";

      return `${capitalize(network)} **** **** **** ${digits}`;
    }
  }
}

type PackagePurchaseSuccessInput = {
  intent: typeof $intent.$inferSelect;
  method?: string;
};

async function processPackagePurchaseSuccess({ intent, method }: PackagePurchaseSuccessInput) {
  if (!intent.user) return { error: "Intent was created for package purchase, but user is not specified", code: 400 };

  const purchase = await db.query.purchase.findFirst({
    where: ($purchase) => eq($purchase.intent, intent.id),
    with: {
      package: { with: { palette: true } },
      user: true,
    },
  });

  if (!purchase) return { error: "Purchase object was not found", code: 400 };

  const [{ id: deposit }] = await db
    .insert($ledger)
    .values({
      user: intent.user,
      amount: purchase.package.amount,
      reason: "package purchase",
    })
    .returning({ id: $ledger.id });

  await db.update($balance).set({
    current: sql`${$balance.current} + ${purchase.package.amount}`,
    overall: sql`${$balance.overall} + ${purchase.package.amount}`,
  });

  await db.update($purchase).set({ deposit });

  await sendPackageReceipt({
    payee: purchase.user.email,
    order: purchase.id,
    name: purchase.package.name,
    palette: purchase.package.palette,
    amount: String(intent.amount / 100).replace(".", ","),
    credits: purchase.package.amount,
    method: method || "",
    features: purchase.package.content,
  });
}

type CapsulePurchaseSuccessInput = {
  intent: typeof $intent.$inferSelect;
  method?: string;
};

async function processCapsulePurchaseSuccess({ intent, method }: CapsulePurchaseSuccessInput) {
  const order = await db.query.order.findFirst({
    where: ($order, { eq }) => eq($order.intent, intent.id),
    with: {
      obligation: {
        with: {
          capsule: { with: { illustration: { with: { upload: true } } } },
          addressees: { with: { digital: true } },
          views: { with: { addressee: { with: { digital: true } } } },
        },
      },
      user: true,
    },
  });

  if (!order) return { error: "No order was found for intent", code: 500 };

  const { obligation, user, payee } = order;
  const { capsule, views, addressees, delivery } = obligation;

  if (obligation.variant !== "digital") return;
  if (!isAfter(new Date(), obligation.delivery)) return;

  if (!capsule) return { error: "No capsule was found for an order", code: 500 };

  const { illustration } = capsule;

  for (const { addressee, token } of views) {
    const parsedAddressee = $digitalAddressee.safeParse(addressee);

    if (parsedAddressee.error) return { error: "Addresses do not match digital addressee schema", code: 500 };

    await notifyCapsuleAddressee({
      to: [parsedAddressee.data.digital.email],
      token,
      capsuleID: capsule.id,
      payee: {
        name: user?.name,
        email: order.payee,
      },
    });
  }

  const parsedAddressees = z.array($digitalAddressee).safeParse(addressees);

  if (parsedAddressees.error) return { error: "Addresses do not match digital addressee schema", code: 500 };

  await notifySender({
    sender: payee,
    title: "Your digital card has been sent",
    product: "capsule",
    designTitle: "Digital Capsule Design",
    illustration: illustration.label,
    paymentMethod: method || "",
    sendDate: formatDate(delivery),
    quantity: addressees.length,
    price: `$${intent.price / 100}`,
    total: `$${intent.amount / 100} VAT incl`,
    addressees: parsedAddressees.data.map(({ digital: { email } }, index) => ({ address: email, index: index + 1 })),
  });
}

type LetterPurchaseSuccessInput = {
  intent: typeof $intent.$inferSelect;
  method?: string;
};

async function processLetterPurchaseSuccess({ intent, method }: LetterPurchaseSuccessInput) {
  const order = await db.query.order.findFirst({
    where: ($order, { eq }) => eq($order.intent, intent.id),
    with: {
      obligation: {
        with: {
          letter: { with: { illustration: { with: { upload: true } } } },
          addressees: { with: { digital: true } },
          views: { with: { addressee: { with: { digital: true } } } },
        },
      },
      user: true,
    },
  });

  if (!order) return { error: "No order was found for intent", code: 500 };

  const { obligation, user, payee } = order;
  const { letter, views, addressees, delivery } = obligation;

  if (obligation.variant !== "digital") return;
  if (!isAfter(new Date(), obligation.delivery)) return;

  if (!letter) return { error: "No letter was found for an order", code: 500 };

  const { illustration } = letter;

  for (const { addressee, token } of views) {
    const parsedAddressee = $digitalAddressee.safeParse(addressee);

    if (parsedAddressee.error) return { error: "Addresses do not match digital addressee schema", code: 500 };

    await notifyLetterAddressee({
      to: [parsedAddressee.data.digital.email],
      token,
      letterID: letter.id,
      payee: {
        name: user?.name,
        email: order.payee,
      },
    });
  }

  const parsedAddressees = z.array($digitalAddressee).safeParse(addressees);

  if (parsedAddressees.error) return { error: "Addresses do not match digital addressee schema", code: 500 };

  await notifySender({
    sender: payee,
    title: "Your digital letter has been sent",
    product: "letter",
    designTitle: "Digital Letter Design",
    illustration: illustration.label,
    paymentMethod: method || "",
    sendDate: formatDate(delivery),
    quantity: addressees.length,
    price: `$${intent.price / 100}`,
    total: `$${intent.amount / 100} VAT incl`,
    addressees: parsedAddressees.data.map(({ digital: { email } }, index) => ({ address: email, index: index + 1 })),
  });
}

async function chargeSucceeded(event: Stripe.ChargeSucceededEvent) {
  const charge = event.data.object;

  if (!charge.payment_intent) return console.error(`No payment intent id on charge.succeeded. Charge id: ${charge.id} `);

  const PID = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id;

  const [intent] = await db.select().from($intent).where(eq($intent.PID, PID));

  if (!intent) return { error: "No intent was found", code: 400 };

  const method = constructMethod(charge.payment_method_details);

  await db
    .update($intent)
    .set({
      method,
      status: "completed",
    })
    .where(eq($intent.PID, PID));

  switch (intent.reason) {
    case "package":
      return await processPackagePurchaseSuccess({ intent, method });
    case "capsule":
      return await processCapsulePurchaseSuccess({ intent, method });
    case "letter":
      return await processLetterPurchaseSuccess({ intent, method });
  }
}

async function chargeFailed(event: Stripe.ChargeFailedEvent) {
  const charge = event.data.object;

  if (!charge.payment_intent) return console.error(`No payment intent id on charge.failed. Charge id: ${charge.id} `);

  const PID = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent.id;

  await db
    .update($intent)
    .set({
      method: constructMethod(charge.payment_method_details),
      status: "failed",
    })
    .where(eq($intent.PID, PID));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlers: Partial<Record<Stripe.Event.Type, (event: any) => Promise<void | { error: string; code: number }>>> = {
  "charge.succeeded": chargeSucceeded,
  "charge.failed": chargeFailed,
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 500 });
  if (!process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Internal error" }, { status: 500 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (_) {
    return NextResponse.json({ error: `Webhook Error` }, { status: 500 });
  }

  const handler = handlers[event.type];

  if (!handler) return NextResponse.json({ received: true }, { status: 200 });

  const result = await handler(event);

  return NextResponse.json({ received: true }, { status: 200 });
}
