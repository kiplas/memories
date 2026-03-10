import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { upload } from "./upload";
import { obligation } from "./obligation";

export const letterIllustration = pgTable("letter_illustration", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  label: text("label").notNull(),
  upload: integer("upload_id").notNull(),
});

export const letter = pgTable("letter", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  illustration: integer("illustration_id").notNull(),
  message: text("message").notNull(),
  obligation: integer("obligation_id").notNull(),
});

export const letterIllustrationRelations = relations(letterIllustration, ({ one }) => ({
  upload: one(upload, {
    fields: [letterIllustration.upload],
    references: [upload.id],
  }),
}));

export const letterRelations = relations(letter, ({ one }) => ({
  illustration: one(letterIllustration, {
    fields: [letter.illustration],
    references: [letterIllustration.id],
  }),
  obligation: one(obligation, {
    fields: [letter.obligation],
    references: [obligation.id],
  }),
}));
