import { mkdir, writeFile, rm } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { upload as schema } from "@/db/schema/upload";
import { eq } from "drizzle-orm";

export async function upload(object: File | Blob | Buffer, { extension }: { extension: string }) {
  const buffer = Buffer.isBuffer(object) ? object : Buffer.from(await object.arrayBuffer());

  const filename = `${crypto.randomUUID()}.${extension}`;
  const filepath = path.join(process.cwd(), "/uploads");
  const url = `/uploads/${filename}`;

  await mkdir(filepath, { recursive: true });
  await writeFile(path.join(filepath, filename), buffer);

  const [upload] = await db.insert(schema).values({ url }).returning({ id: schema.id });

  const { id } = upload;

  return { id, filename, url };
}

export async function remove(ID: number) {
  const [{ url }] = await db.delete(schema).where(eq(schema.id, ID)).returning({ url: schema.url });

  await rm(path.join(process.cwd(), url));
}
