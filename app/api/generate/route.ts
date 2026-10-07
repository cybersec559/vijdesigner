import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { isStudioAuthed } from "@/lib/studio-auth";
import { copySchema } from "@/lib/types";
import { imageFromForm } from "@/lib/uploads";

export const runtime = "nodejs";

const prompt = [
  "You write for Atelier, a handmade jewelry and crafts studio.",
  "Look at this photograph and describe only what you can see.",
  "Write warm, specific copy in the maker's voice.",
  "Skip clichés such as timeless elegance, elevate your style, and perfect for any occasion.",
  "name: a short piece name.",
  "category: Necklace, Earrings, Ring, Bracelet, or Craft.",
  "materials: what the piece appears to be made from.",
  "story: two or three sentences, first person, from the maker.",
  "adHeadline: under eight words.",
  "adBody: one sentence.",
  "socialCaption: one or two sentences, no hashtags.",
  "altText: a plain description of the photograph for someone who cannot see it.",
].join(" ");

export async function POST(request: Request) {
  if (!(await isStudioAuthed())) {
    return NextResponse.json({ error: "Sign in to the studio." }, { status: 401 });
  }
  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Add AI_GATEWAY_API_KEY to .env.local, then restart the dev server.",
      },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const image = imageFromForm(form.get("image"));
  if (!image.ok) {
    return NextResponse.json({ error: image.error }, { status: 400 });
  }

  try {
    const bytes = new Uint8Array(await image.file.arrayBuffer());
    const result = await generateText({
      model: "openai/gpt-5.4",
      output: Output.object({
        schema: copySchema,
        name: "JewelryAd",
        description: "Ad copy for one handmade jewelry or craft piece",
      }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: bytes, mediaType: image.file.type },
          ],
        },
      ],
    });

    const copy = copySchema.safeParse(result.output);
    if (!copy.success) {
      return NextResponse.json(
        { error: "The model returned copy that did not fit the piece." },
        { status: 502 },
      );
    }
    return NextResponse.json(copy.data);
  } catch {
    return NextResponse.json(
      { error: "The model could not write this piece. Try again." },
      { status: 502 },
    );
  }
}
