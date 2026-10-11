import { generateText } from "ai";
import { NextResponse } from "next/server";
import { readFrame } from "@/lib/frame-file";
import { frames, isFrameId } from "@/lib/frames";
import { isStudioAuthed } from "@/lib/studio-auth";
import { imageFromForm } from "@/lib/uploads";

export const runtime = "nodejs";
export const maxDuration = 60;

const model = "google/gemini-2.5-flash-image";

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
  const frameValue = form.get("frame");
  if (typeof frameValue !== "string" || !isFrameId(frameValue)) {
    return NextResponse.json({ error: "Choose a frame." }, { status: 400 });
  }

  try {
    const jewelry = new Uint8Array(await image.file.arrayBuffer());
    const reference = await readFrame(frameValue);
    const result = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: frames[frameValue].prompt },
            { type: "image", image: jewelry, mediaType: image.file.type },
            { type: "image", image: reference, mediaType: "image/jpeg" },
          ],
        },
      ],
    });

    const portrait = result.files.find((file) =>
      file.mediaType.startsWith("image/"),
    );
    if (!portrait) {
      return NextResponse.json(
        { error: "The model did not return a portrait. Try again." },
        { status: 502 },
      );
    }
    if (
      portrait.mediaType !== "image/png" &&
      portrait.mediaType !== "image/jpeg" &&
      portrait.mediaType !== "image/webp"
    ) {
      return NextResponse.json(
        { error: "The portrait came back in a format the studio cannot keep." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      mediaType: portrait.mediaType,
      image: portrait.base64,
    });
  } catch {
    return NextResponse.json(
      { error: "The model could not place this piece. Try again." },
      { status: 502 },
    );
  }
}
