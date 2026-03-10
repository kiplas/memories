import { pgTable, integer, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { capsule } from "./capsule";
import { letter } from "./letter";
import { addressee } from "./addressee";
import { view } from "./view";
import { order } from "./order";

export const obligation = pgTable("obligation", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  variant: text("variant", { enum: ["printed", "digital"] }).notNull(),
  delivery: timestamp("delivery_date", { mode: "date", withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  fulfilled: boolean("fulfilled").default(false).notNull(),
});

export const obligationRelations = relations(obligation, ({ one, many }) => ({
  capsule: one(capsule),
  letter: one(letter),
  addressees: many(addressee),
  views: many(view),
  order: one(order),
}));
