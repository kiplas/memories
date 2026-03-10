import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { upload } from "./upload";
import { obligation } from "./obligation";

export const capsuleIllustration = pgTable("caspsule_illustration", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  label: text("label").notNull(),
  upload: integer("upload_id").notNull(),
  background: text("background"),
  foreground: text("foreground"),
});

export const capsule = pgTable("capsule", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  illustration: integer("illustration_id").notNull(),
  message: text("message"),
  obligation: integer("obligation_id")
    .references(() => obligation.id)
    .notNull(),
});

export const capsuleUploads = pgTable("capsule_uploads", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  capsule: integer("capsule_id"),
  upload: integer("upload_id"),
});

export const capsuleIllustrationRelations = relations(capsuleIllustration, ({ one }) => ({
  upload: one(upload, {
    fields: [capsuleIllustration.upload],
    references: [upload.id],
  }),
}));

export const capsuleRelations = relations(capsule, ({ one, many }) => ({
  uploads: many(capsuleUploads),
  illustration: one(capsuleIllustration, {
    fields: [capsule.illustration],
    references: [capsuleIllustration.id],
  }),
  obligation: one(obligation, {
    fields: [capsule.obligation],
    references: [obligation.id],
  }),
}));

export const capsuleUploadsRelations = relations(capsuleUploads, ({ one }) => ({
  upload: one(upload, {
    fields: [capsuleUploads.upload],
    references: [upload.id],
  }),
  capsule: one(capsule, {
    fields: [capsuleUploads.capsule],
    references: [capsule.id],
  }),
}));
