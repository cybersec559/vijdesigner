import { NextResponse } from "next/server";
import { addPiece, readPieces } from "@/lib/pieces";
import { isStudioAuthed } from "@/lib/studio-auth";
import { copySchema, pieceSchema } from "@/lib/types";
import { imageFromForm, saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";

const fieldNames = [
  "name",
  "category",
  "materials",
  "story",
  "adHeadline",
  "adBody",
  "socialCaption",
  "altText",
] as const;

export async function GET() {
  const pieces = await readPieces();
  return NextResponse.json(pieces);
}

export async function POST(request: Request) {
  if (!(await isStudioAuthed())) {
    return NextResponse.json({ error: "Sign in to the studio." }, { status: 401 });
  }

  const form = await request.formData();
  const image = imageFromForm(form.get("image"));
  if (!image.ok) {
    return NextResponse.json({ error: image.error }, { status: 400 });
  }

  const rawCopy = Object.fromEntries(
    fieldNames.map((name) => {
      const value = form.get(name);
      return [name, typeof value === "string" ? value : ""];
    }),
  );
  const copy = copySchema.safeParse(rawCopy);
  if (!copy.success) {
    return NextResponse.json(
      { error: "Fill in every field before publishing." },
      { status: 400 },
    );
  }

  const saved = await saveUpload(image.file);
  const piece = pieceSchema.parse({
    ...copy.data,
    id: saved.id,
    image: saved.image,
    createdAt: new Date().toISOString(),
  });
  await addPiece(piece);
  return NextResponse.json(piece);
}
