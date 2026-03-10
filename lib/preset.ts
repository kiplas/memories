import { db } from "@/db";
import { digitalCapsule as $digitalCapsulePreset, printedCapsule as $printedCapsulePreset, digitalLetter as $digitalLetterPreset } from "@/schema/preset";
import { getUser } from "@/server/trpc/queries/session";

export async function getDigitalCapsulePreset(OrderIDParam: string | string[] | undefined) {
  if (typeof OrderIDParam !== "string") return null;

  const user = await getUser();

  if (!user) return null;

  const order = await db.query.order.findFirst({
    where: ($order, { eq, and }) => and(eq($order.id, parseInt(OrderIDParam)), eq($order.user, user.id)),

    with: {
      obligation: {
        with: {
          capsule: {
            with: {
              illustration: { with: { upload: true } },
              uploads: { with: { upload: true } },
            },
          },
          addressees: {
            with: {
              digital: true,
              physical: true,
            },
          },
        },
      },
    },
  });

  if (!order || order.obligation.variant !== "digital") return null;

  const parsed = $digitalCapsulePreset.parse({ order });

  return parsed;
}

export async function getPrintedCapsulePreset(OrderIDParam: string | string[] | undefined) {
  if (typeof OrderIDParam !== "string") return null;

  const user = await getUser();

  if (!user) return null;

  const order = await db.query.order.findFirst({
    where: ($order, { eq, and }) => and(eq($order.id, parseInt(OrderIDParam)), eq($order.user, user.id)),

    with: {
      obligation: {
        with: {
          capsule: {
            with: {
              illustration: { with: { upload: true } },
              uploads: { with: { upload: true } },
            },
          },
          addressees: {
            with: {
              digital: true,
              physical: true,
            },
          },
        },
      },
    },
  });

  if (!order || order.obligation.variant !== "printed") return null;

  const parsed = $printedCapsulePreset.parse({ order });

  return parsed;
}

export async function getDigitalLetterPreset(OrderIDParam: string | string[] | undefined) {
  if (typeof OrderIDParam !== "string") return null;

  const user = await getUser();

  if (!user) return null;

  const order = await db.query.order.findFirst({
    where: ($order, { eq, and }) => and(eq($order.id, parseInt(OrderIDParam)), eq($order.user, user.id)),

    with: {
      obligation: {
        with: {
          letter: {
            with: {
              illustration: { with: { upload: true } },
            },
          },
          addressees: {
            with: {
              digital: true,
              physical: true,
            },
          },
        },
      },
    },
  });

  if (!order || order.obligation.variant !== "digital") return null;

  const parsed = $digitalLetterPreset.parse({ order });

  return parsed;
}
