import { db } from "@/db";
import { protectedProcedure } from "../trpc";
import { eq, count, and, exists, or, lt, desc } from "drizzle-orm";
import { order as $order } from "@/db/schema/order";
import { obligation as $obligation } from "@/db/schema/obligation";
import { capsule as $capsule } from "@/db/schema/capsule";
import { letter as $letter } from "@/db/schema/letter";
import z from "zod";

const capsulesInput = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z
    .object({
      delivery: z.date(),
      id: z.number(),
    })
    .nullish(),
});

export const capsules = protectedProcedure.input(capsulesInput).query(async ({ ctx, input }) => {
  const { session } = ctx;
  const { limit, cursor } = input;

  // --- STEP 1: FIND THE IDS (The "Search" Phase) ---
  const rows = await db
    .select({ id: $order.id }) // We only need the ID to start
    .from($order)
    .innerJoin($obligation, eq($order.obligation, $obligation.id))
    .where(
      and(
        eq($order.user, session.user.id),
        exists(db.select().from($capsule).where(eq($capsule.obligation, $order.obligation))),
        // Composite Cursor: Sort by delivery date, tie-break with ID
        cursor ? or(lt($obligation.delivery, cursor.delivery), and(eq($obligation.delivery, cursor.delivery), eq($order.id, cursor.id))) : undefined,
      ),
    )
    .orderBy(desc($obligation.delivery), desc($order.id))
    .limit(limit + 1);

  if (rows.length === 0) {
    return { orders: [], nextCursor: undefined };
  }

  const orderIds = rows.map((r) => r.id);

  // --- STEP 2: FETCH FULL OBJECTS (The "Hydration" Phase) ---
  const fullOrders = await db.query.order.findMany({
    where: ($order, { inArray }) => inArray($order.id, orderIds),
    with: {
      obligation: {
        with: {
          capsule: {
            with: {
              illustration: { with: { upload: true } },
              uploads: { with: { upload: true } },
            },
          },
        },
      },
    },
  });

  // IMPORTANT: inArray does NOT preserve the order from Step 1.
  // We must re-sort the results to match our cursor order.
  const sortedOrders = orderIds.map((id) => fullOrders.find((o) => o.id === id)).filter((o): o is NonNullable<typeof o> => !!o);

  // --- PREPARE NEXT CURSOR ---
  let nextCursor: typeof cursor | undefined = undefined;

  if (sortedOrders.length > limit) {
    const nextItem = sortedOrders.pop(); // Remove the 11th item

    if (nextItem) {
      nextCursor = {
        delivery: nextItem.obligation.delivery,
        id: nextItem.id,
      };
    }
  }

  return {
    orders: sortedOrders,
    nextCursor,
  };
});

const lettersInput = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z
    .object({
      delivery: z.date(),
      id: z.number(),
    })
    .nullish(),
});

export const letters = protectedProcedure.input(lettersInput).query(async ({ ctx, input }) => {
  const { session } = ctx;
  const { limit, cursor } = input;

  // --- STEP 1: FIND THE IDS (The "Search" Phase) ---
  const rows = await db
    .select({ id: $order.id }) // We only need the ID to start
    .from($order)
    .innerJoin($obligation, eq($order.obligation, $obligation.id))
    .where(
      and(
        eq($order.user, session.user.id),
        exists(db.select().from($letter).where(eq($letter.obligation, $order.obligation))),
        // Composite Cursor: Sort by delivery date, tie-break with ID
        cursor ? or(lt($obligation.delivery, cursor.delivery), and(eq($obligation.delivery, cursor.delivery), eq($order.id, cursor.id))) : undefined,
      ),
    )
    .orderBy(desc($obligation.delivery), desc($order.id))
    .limit(limit + 1);

  if (rows.length === 0) {
    return { orders: [], nextCursor: undefined };
  }

  const orderIds = rows.map((r) => r.id);

  // --- STEP 2: FETCH FULL OBJECTS (The "Hydration" Phase) ---
  const fullOrders = await db.query.order.findMany({
    where: ($order, { inArray }) => inArray($order.id, orderIds),
    with: {
      obligation: {
        with: {
          addressees: {
            with: {
              digital: true,
              physical: true,
            },
          },
          letter: {
            with: {
              illustration: { with: { upload: true } },
            },
          },
        },
      },
    },
  });

  // IMPORTANT: inArray does NOT preserve the order from Step 1.
  // We must re-sort the results to match our cursor order.
  const sortedOrders = orderIds.map((id) => fullOrders.find((o) => o.id === id)).filter((o): o is NonNullable<typeof o> => !!o);

  // --- PREPARE NEXT CURSOR ---
  let nextCursor: typeof cursor | undefined = undefined;

  if (sortedOrders.length > limit) {
    const nextItem = sortedOrders.pop(); // Remove the 11th item

    if (nextItem) {
      nextCursor = {
        delivery: nextItem.obligation.delivery,
        id: nextItem.id,
      };
    }
  }

  return {
    orders: sortedOrders,
    nextCursor,
  };
});

export const capsuleCount = protectedProcedure.query(async ({ ctx }) => {
  const { session } = ctx;

  const [result] = await db
    .select({ value: count() })
    .from($capsule)
    .innerJoin($obligation, eq($capsule.obligation, $obligation.id))
    .innerJoin($order, eq($order.obligation, $obligation.id))
    .where(eq($order.user, session.user.id));

  return result?.value || 0;
});

export const letterCount = protectedProcedure.query(async ({ ctx }) => {
  const { session } = ctx;

  const [result] = await db
    .select({ value: count() })
    .from($letter)
    .innerJoin($obligation, eq($letter.obligation, $obligation.id))
    .innerJoin($order, eq($order.obligation, $obligation.id))
    .where(eq($order.user, session.user.id));

  return result?.value || 0;
});
