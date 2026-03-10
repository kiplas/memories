import { db } from "@/db";
import { capsuleIllustration as $capsuleIllustration } from "@/db/schema/capsule";
import { letterIllustration as $letterIllustration } from "@/db/schema/letter";
import { upload } from "@/server/uploads";
import { readFile } from "fs/promises";
import path from "path";

const capsuleIllustrations = [
  { label: "Ancient Totems", filename: "ancient-totems.png", background: "#000000", foreground: "#FFFFFF" },
  { label: "Bazar", filename: "bazar.png", background: "#34080D", foreground: "#FFFFFF" },
  { label: "Jardin Majorelle", filename: "jardin-majorelle.png", background: "#21160E", foreground: "#FFFFFF" },
  { label: "Lost in the Desert", filename: "lost-in-the-desert.png", foreground: "#FFFFFF" },
  { label: "Midday Heat", filename: "midday-heat.png", foreground: "#FFFFFF" },
  { label: "Sarafi Animals", filename: "safari-animals.png", background: "#F8F1E2", foreground: "#000000" },
  { label: "Savannah", filename: "savannah.png", foreground: "#FFFFFF" },
  { label: "Sunset Fever", filename: "sunset-fever.png", foreground: "#FFFFFF" },
  { label: "Treasure Hunter", filename: "treasure-hunter.png", background: "#000000", foreground: "#FFFFFF" },
  { label: "Unique Culture", filename: "unique-culture.png", background: "#F9E7E3", foreground: "#344849" },
  { label: "Vineyard", filename: "vineyard.png", foreground: "#FFFFFF" },
  { label: "Waterfalls", filename: "waterfalls.png", foreground: "#FFFFFF" },
  { label: "Wild Cat", filename: "wild-cat.png", foreground: "#FFFFFF" },
  { label: "Wild Roots", filename: "wild-roots.png", foreground: "#350606" },
];

const letterIllustrations = [
  { label: "Me Dear Friend", filename: "a.png" },
  { label: "Across Time", filename: "b.png" },
  { label: "To someone...", filename: "c.png" },
];

const uploadsDirname = path.join(process.cwd(), "./db/seed/illustrations/uploads");

async function seedCapsuleIllustrations() {
  const count = await db.$count($capsuleIllustration);

  if (count > 0) return;

  for (const { label, filename, background } of capsuleIllustrations) {
    const buffer = await readFile(path.join(path.join(uploadsDirname, "./capsule"), filename));
    const { id: uploadID } = await upload(buffer, { extension: "png" });

    await db.insert($capsuleIllustration).values({
      label,
      background,
      upload: uploadID,
    });
  }
}

async function seedLetterIllustrations() {
  const count = await db.$count($letterIllustration);

  if (count > 0) return;

  for (const { label, filename } of letterIllustrations) {
    const buffer = await readFile(path.join(path.join(uploadsDirname, "./letter"), filename));
    const { id: uploadID } = await upload(buffer, { extension: "png" });

    await db.insert($letterIllustration).values({
      upload: uploadID,
      label,
    });
  }
}

export async function seed() {
  await seedCapsuleIllustrations();
  await seedLetterIllustrations();
}
