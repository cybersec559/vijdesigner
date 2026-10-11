import { promises as fs } from "node:fs";
import path from "node:path";
import { frames, type FrameId } from "@/lib/frames";

export async function readFrame(id: FrameId): Promise<Uint8Array> {
  const frame = frames[id];
  const directory = path.resolve(process.cwd(), "public", "uploads");
  const target = path.resolve(directory, frame.reference);
  if (!target.startsWith(`${directory}${path.sep}`)) {
    throw new Error("Could not read this frame.");
  }
  const bytes = await fs.readFile(target);
  return new Uint8Array(bytes);
}
