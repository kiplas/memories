import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { obligation } from "./obligation";
import { relations } from "drizzle-orm";

export const addressee = pgTable("addressee", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  obligation: integer("obligation_id")
    .notNull()
    .references(() => obligation.id),
});

export const digitalAddress = pgTable("digital_address", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  addressee: integer("addressee_id").notNull(),
  email: text("email"),
});

export const physicalAddress = pgTable("physical_address", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  addressee: integer("addressee_id").notNull(),
  name: text("full_name").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
});

export const addresseeRelations = relations(addressee, ({ one }) => ({
  obligation: one(obligation, {
    fields: [addressee.obligation],
    references: [obligation.id],
  }),
  digital: one(digitalAddress),
  physical: one(physicalAddress),
}));

export const physicalAddressRelations = relations(physicalAddress, ({ one }) => ({
  addressee: one(addressee, {
    fields: [physicalAddress.addressee],
    references: [addressee.id],
  }),
}));

export const digitalAddressRelations = relations(digitalAddress, ({ one }) => ({
  addressee: one(addressee, {
    fields: [digitalAddress.addressee],
    references: [addressee.id],
  }),
}));
