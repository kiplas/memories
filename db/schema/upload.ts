import { integer, pgTable, text, timestamp,  } from "drizzle-orm/pg-core";

export const upload = pgTable("upload", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

