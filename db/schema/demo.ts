import { pgTable, integer, text, timestamp } from "drizzle-orm/pg-core";

export const demoRequest = pgTable("demo_request", {
  id: integer("id").generatedByDefaultAsIdentity().notNull().primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
});
