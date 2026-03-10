import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { addressee } from "./addressee";
import { relations } from "drizzle-orm";
import { obligation } from "./obligation";

export const view = pgTable("view", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey().notNull(),
  token: text("token").notNull(),
  obligation: integer("obligation").notNull(),
  addressee: integer("addressee").notNull(),
  viewedAt: timestamp("viewed_at", { mode: "date", withTimezone: true }),
});

export const viewRelations = relations(view, ({ one }) => ({
  addressee: one(addressee, {
    fields: [view.addressee],
    references: [addressee.id],
  }),
  obligation: one(obligation, {
    fields: [view.obligation],
    references: [obligation.id],
  }),
}));
