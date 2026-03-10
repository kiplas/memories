import { relations } from "drizzle-orm";
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { plan } from "./package";
import { user } from "./auth";

export const purchase = pgTable("package_purchase", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey().notNull(),
  intent: integer("intent").notNull(),
  package: integer("package").notNull(),
  user: text("user").notNull(),
  deposit: integer("deposit"),
});

export const purchaseRelations = relations(purchase, ({ one }) => ({
  package: one(plan, {
    fields: [purchase.package],
    references: [plan.id],
  }),
  user: one(user, {
    fields: [purchase.user],
    references: [user.id],
  }),
}));
