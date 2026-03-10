import { relations } from "drizzle-orm";
import { pgTable, integer, text, json } from "drizzle-orm/pg-core";

type Content = string[];

export const planPalette = pgTable("plan_palette", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey().notNull(),
  background: text("background").notNull(),
  foreground: text("foreground").notNull(),
  aux: text("aux").notNull(),
  gradient: text("gradient"),
});

export const plan = pgTable("package", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey().notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  icon: text("icon", { enum: ["dove", "continent", "plane"] }).notNull(),
  content: json("content").$type<Content>().notNull(),
  summary: text("summary").notNull(),
  amount: integer("amount").notNull(),
  palette: integer("palette_id").notNull(),
  verb: text("verb").notNull(),
  slug: text("slug").notNull(),
});

export const planRelations = relations(plan, ({ one }) => ({
  palette: one(planPalette, {
    fields: [plan.palette],
    references: [planPalette.id],
  }),
}));
