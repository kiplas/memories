import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const ledger = pgTable("ledger", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  user: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
});
