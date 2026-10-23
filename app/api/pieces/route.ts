import { NextResponse } from "next/server";
import { addPiece, readPieces } from "@/lib/pieces";
import { displayPrice } from "@/lib/price";
import { syncPricedPiece } from "@/lib/shopify-catalog";
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

  const priceField = form.get("price");
  const priceText = typeof priceField === "string" ? priceField.trim() : "";
  let price: string | undefined;
  if (priceText) {
    price = displayPrice(priceText);
    if (!price || price.length > 40) {
      return NextResponse.json({ error: "Enter a price like $12." }, { status: 400 });
    }
  }

  const saved = await saveUpload(image.file);
  const piece = pieceSchema.parse({
    ...copy.data,
    id: saved.id,
    image: saved.image,
    createdAt: new Date().toISOString(),
    ...(price ? { price } : {}),
  });
  await addPiece(piece);

  let shopifyError: string | undefined;
  if (price) {
    try {
      await syncPricedPiece(piece);
    } catch (cause) {
      shopifyError =
        cause instanceof Error
          ? cause.message
          : "Shopify could not be updated for this price.";
    }
  }

  return NextResponse.json({ piece, shopifyError });
}
