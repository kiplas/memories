import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import mime from "mime-types";

export async function GET(
  _: NextRequest,
  {
    params,
  }: {
    params: Promise<{ file: string }>;
  },
) {
  const { file } = await params;
  const filePath = path.resolve(process.cwd(), `uploads/${file}`);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("not found", { status: 400 });
  }

  const buffer = fs.readFileSync(filePath);
  const contentType = mime.contentType(filePath) || "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}
