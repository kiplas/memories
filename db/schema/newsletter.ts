import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const subscriber = pgTable("newsletter_subscriber", {
  id: integer("id").generatedByDefaultAsIdentity().notNull().primaryKey(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  email: text("email").notNull(),
});
