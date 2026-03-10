import { db } from "@/db/";
import { plan as $package, planPalette as $planPalette, planPalette } from "@/db/schema/package";

type Palette = typeof $planPalette.$inferInsert;
type Package = Omit<typeof $package.$inferInsert, "palette">;

const packages: (Package & { palette: Palette })[] = [
  {
    name: "Starter",
    price: 499,
    icon: "plane",
    content: ["5 digital/printed capsules or Letters", "Standard templates", "Secure delivery"],
    summary: "Start with one free capsule to see how it works.",
    amount: 5,
    slug: "start",
    verb: "Start",
    palette: {
      background: "#D9D9D9",
      foreground: "#000000",
      aux: "#F6F0EE",
    },
  },
  {
    name: "Standard",
    price: 2900,
    icon: "continent",
    content: ["30 digital capsules", "Advanced templates", "HD video support"],
    summary: "Create as many digital capsules as you want with more design options.",
    amount: 30,
    verb: "Upgrade to",
    slug: "standard",
    palette: {
      background: "#C0B4AD",
      foreground: "#FFFFFF",
      aux: "#F6F0EE",
    },
  },
  {
    name: "Premium",
    price: 4900,
    icon: "dove",
    content: ["50 digital capsules", "Printed capsule credit", "Designer assistance"],
    summary: "Get everything from Standard plus printed capsules, personal help, and priority support.",
    amount: 50,
    verb: "Go",
    slug: "premium",
    palette: {
      background: "#000000",
      foreground: "#FFFFFF",
      aux: "#FDF7DE",
      gradient: '"#383433", "#FDF7DE"',
    },
  },
];

export async function seed() {
  const count = await db.$count($package);

  if (count > 0) return;

  for (const { palette, ...pkg } of packages) {
    const [{ id: paletteID }] = await db.insert($planPalette).values(palette).returning({ id: planPalette.id });
    await db.insert($package).values({ ...pkg, palette: paletteID });
  }
}
