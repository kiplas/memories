import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const balance = pgTable("balance", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey().notNull(),
  user: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  current: integer("current").notNull(),
  overall: integer("overall").notNull(),
});
