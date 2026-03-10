import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const intent = pgTable("intent", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  PID: text("payment_intent_id").notNull(),
  price: integer("price").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason", { enum: ["package", "capsule", "letter"] }).notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  status: text("status", { enum: ["completed", "pending", "failed"] })
    .default("pending")
    .notNull(),
  method: text("method"),
  user: text("user_id"),
});
