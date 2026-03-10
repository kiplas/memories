import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { obligation } from "./obligation";
import { intent } from "./intent";
import { ledger } from "./ledger";

export const order = pgTable("order", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  user: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  payee: text("payee_email").notNull(),
  intent: integer("intent_id"),
  charge: integer("ledger_id"),
  obligation: integer("obligation_id").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export const orderRelations = relations(order, ({ one }) => ({
  user: one(user, {
    fields: [order.user],
    references: [user.id],
  }),
  obligation: one(obligation, {
    fields: [order.obligation],
    references: [obligation.id],
  }),
  intent: one(intent, {
    fields: [order.intent],
    references: [intent.id],
  }),
  charge: one(ledger, {
    fields: [order.charge],
    references: [ledger.id],
  }),
}));
