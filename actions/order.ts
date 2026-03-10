"use server";

import type { Maybe, Illustration, Addressee, Session, PhysicalAddressee, DigitalAddressee } from "@/types";
import { db } from "@/db";
import { balance as $balance } from "@/db/schema/balance";
import { ledger as $ledger } from "@/db/schema/ledger";
import { capsule as $capsule, capsuleUploads as $capsuleUploads } from "@/db/schema/capsule";
import { physicalAddress as $physicalAddress, digitalAddress as $digitalAddress, addressee as $addressee } from "@/db/schema/addressee";
import { obligation as $obligation } from "@/db/schema/obligation";
import { order as $order } from "@/db/schema/order";
import { letter as $letter } from "@/db/schema/letter";
import { view as $view } from "@/db/schema/view";
import { headers } from "next/headers";
import { prices } from "@/mock/prices";
import { upload } from "@/server/uploads";
import { auth } from "@/server/auth";
import { eq } from "drizzle-orm";
import { isAfter } from "date-fns";
import { notifyCapsuleAddressee, notifyLetterAddressee, notifySender } from "@/server/mail";
import crypto from "crypto";
import mime from "mime-types";
import { formatDate } from "@/lib/date";
import { Upload } from "@/state/capsule";

type Capsule = {
  uploads: Upload[];
  illustration: Illustration;
  message?: Maybe<string>;
};

type Letter = {
  illustration: Illustration;
  message: string;
};

type Payment =
  | {
      method: "OTP";
      intent: number;
    }
  | { method: "credits"; intent?: never };

type Obligation =
  | {
      variant: "printed";
      delivery: Date;
      addressees: PhysicalAddressee[];
    }
  | {
      variant: "digital";
      delivery: Date;
      addressees: DigitalAddressee[];
    };

type Product =
  | {
      product: "capsule";
      body: Capsule;
    }
  | {
      product: "letter";
      body: Letter;
    };

type Meta = {
  payee: string;
};

type Order = Payment & Obligation & Product & Meta;

async function createCharge({ amount, reason, session }: { amount: number; reason: string; session: Session }) {
  const [balance] = await db.select().from($balance).where(eq($balance.user, session.user.id));

  if (balance.current - amount < 0) throw new Error("Not enough credits");

  await db
    .update($balance)
    .set({ current: balance.current - amount })
    .where(eq($balance.id, balance.id));

  const [{ id }] = await db.insert($ledger).values({ amount: -amount, user: session.user.id, reason }).returning({ id: $ledger.id });

  return { id };
}

async function verifyUploadExistanceAndReturn(rawUpload: { id: number }) {
  const existing = await db.query.upload.findFirst({
    where: ($upload, { eq }) => eq($upload.id, rawUpload.id),
  });

  if (existing === undefined) throw new Error("Could't find an upload");

  return existing;
}

async function createCapsule({ uploads: rawUploads, illustration, message, obligation }: Capsule & { obligation: number }) {
  const [capsule] = await db.insert($capsule).values({ message, illustration: illustration.id, obligation }).returning({ id: $capsule.id });

  const uploads = await Promise.all(
    rawUploads.map((rawUpload) => {
      if (rawUpload instanceof File) return upload(rawUpload, { extension: mime.extension(rawUpload.type) || "webp" });
      return verifyUploadExistanceAndReturn(rawUpload);
    }),
  );

  await Promise.all(uploads.map(({ id }) => db.insert($capsuleUploads).values({ upload: id, capsule: capsule.id })));

  return capsule.id;
}

async function createLetter({ message, illustration, obligation }: Letter & { obligation: number }) {
  const [letter] = await db.insert($letter).values({ message, illustration: illustration.id, obligation }).returning({ id: $letter.id });

  return letter.id;
}

async function createAddressee({ digital, physical, obligation, variant }: Addressee & { obligation: number; variant: Obligation["variant"] }) {
  const [addressee] = await db.insert($addressee).values({ obligation }).returning({ id: $addressee.id });

  if (!digital && !physical) throw new Error("Unable to add addressee as both digital and physical addresses are missing");

  if (digital) await db.insert($digitalAddress).values({ ...digital, addressee: addressee.id });
  if (physical) await db.insert($physicalAddress).values({ ...physical, addressee: addressee.id });

  if (variant === "digital") {
    const [view] = await db
      .insert($view)
      .values({ addressee: addressee.id, obligation, token: crypto.randomBytes(8).toString("hex") })
      .returning({ token: $view.token });

    return { view, digital, physical };
  }

  return { addressee };
}

async function createObligation({ variant, delivery }: Omit<Obligation, "addressees">) {
  const [obligation] = await db.insert($obligation).values({ variant, delivery }).returning({ id: $obligation.id });
  return obligation;
}

type CreateOrderInput = {
  user?: string;
  payee: string;
  obligation: number;
} & ({ intent: number; charge?: never } | { intent?: never; charge: number });

async function createOrder({ user, payee, obligation, intent, charge }: CreateOrderInput) {
  if (charge !== undefined && intent !== undefined) throw new Error("Tried to use a charge and stripe transaction at the same time as payment method");

  const [order] = await db.insert($order).values({ user, payee, obligation, intent, charge }).returning({ id: $order.id });
  return order;
}

export async function order(order: Order) {
  const { method, variant, delivery, payee, intent, product, body } = order;
  if (order.addressees.length === 0) return { error: "No addressee was specified" };

  const session = await auth.api.getSession({ headers: await headers() });

  const obligation = await createObligation({ variant, delivery });
  const addressees = await Promise.all(order.addressees.map((addressee) => createAddressee({ ...addressee, obligation: obligation.id, variant })));

  let capsuleID: number | null = null;
  let letterID: number | null = null;

  if (product === "capsule") capsuleID = await createCapsule({ ...body, obligation: obligation.id });
  if (product === "letter") letterID = await createLetter({ ...body, obligation: obligation.id });

  if (method === "credits") {
    if (!session) return { error: "Unable to charge user as no active user session was found" };

    const price = prices[product][variant].credits;
    const amount = price * addressees.length;

    const charge = await createCharge({ amount, reason: "Order payment", session });

    const order = await createOrder({ user: session.user.id, payee, obligation: obligation.id, charge: charge.id });

    /* 
      Immediately send both sender (payee) and recipient
      if it is supposed to be send immediately
    */

    if (variant === "digital" && isAfter(new Date(), delivery)) {
      notifySender({
        sender: payee,
        title: product === "capsule" ? "Your digital card has been sent" : "Your digital letter has been sent",
        product: product,
        designTitle: product === "capsule" ? "Digital Capsule Design" : "Digital Letter Design",
        illustration: body.illustration.label,
        paymentMethod: "Credits",
        sendDate: formatDate(delivery),
        quantity: addressees.length,
        price: `${price} ${price > 1 ? "credits" : "credit"}`,
        total: `${amount} ${price > 1 ? "credits" : "credit"}`,
        addressees: addressees.map(({ digital }, index) => {
          if (!digital) throw new Error("If variant is digital view must be created for each addressee");
          return { address: digital.email, index: index + 1 };
        }),
      });

      for (const { view, digital } of addressees) {
        if (!view || !digital) throw new Error("If variant is digital view must be created for each addressee");

        if (product === "capsule" && capsuleID) {
          notifyCapsuleAddressee({
            to: [digital.email],
            token: view.token,
            capsuleID,
            payee: {
              name: session.user.name,
              email: payee,
            },
          });
        } else if (product === "letter" && letterID) {
          notifyLetterAddressee({
            to: [digital.email],
            token: view.token,
            letterID,
            payee: {
              name: session.user.name,
              email: payee,
            },
          });
        }
      }
    }

    return { success: true, order: order.id };
  } else {
    const order = await createOrder({ user: session?.user.id, payee, obligation: obligation.id, intent });
    return { success: true, order: order.id };
  }
}
