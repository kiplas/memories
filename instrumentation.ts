import { db } from "@/db";
import { seed } from "@/db/seed";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function register() {
  if (process.env.NODE_ENV === "production") {
    await migrate(db, {
      migrationsFolder: "./db/migrations",
      migrationsTable: "migrations",
      migrationsSchema: "public",
    });
  }

  await seed();
}
