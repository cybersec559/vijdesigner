import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

type ImageExtension = "jpg" | "png" | "webp" | "gif";

function extensionFor(type: string): ImageExtension | undefined {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return undefined;
  }
}

const maxBytes = 8 * 1024 * 1024;

export function imageFromForm(
  value: FormDataEntryValue | null,
): { ok: true; file: File } | { ok: false; error: string } {
  if (!(value instanceof File) || value.size === 0) {
    return { ok: false, error: "Choose an image of the piece." };
  }
  if (!extensionFor(value.type)) {
    return { ok: false, error: "Use a JPEG, PNG, WebP, or GIF." };
  }
  if (value.size > maxBytes) {
    return { ok: false, error: "Images need to be under 8 MB." };
  }
  return { ok: true, file: value };
}

export async function saveUpload(file: File): Promise<{ id: string; image: string }> {
  const extension = extensionFor(file.type);
  if (!extension) {
    throw new Error("Unsupported image type.");
  }
  const id = randomUUID();
  const filename = `${id}.${extension}`;
  const directory = path.resolve(process.cwd(), "public", "uploads");
  const target = path.resolve(directory, filename);
  if (!target.startsWith(`${directory}${path.sep}`)) {
    throw new Error("Could not store this upload.");
  }
  await fs.mkdir(directory, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(target, bytes);
  return { id, image: `/uploads/${filename}` };
}
