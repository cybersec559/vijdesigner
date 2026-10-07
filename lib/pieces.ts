import { promises as fs } from "node:fs";
import path from "node:path";
import { pieceSchema, type Piece } from "@/lib/types";

const piecesPath = path.join(process.cwd(), "data", "pieces.json");

let writeQueue: Promise<unknown> = Promise.resolve();

export async function readPieces(): Promise<Piece[]> {
  const raw = await fs.readFile(piecesPath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((item) => {
    const result = pieceSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });
}

export async function addPiece(piece: Piece): Promise<void> {
  const run = writeQueue.then(async () => {
    const pieces = await readPieces();
    const next = [piece, ...pieces.filter((item) => item.id !== piece.id)];
    await fs.writeFile(piecesPath, `${JSON.stringify(next, null, 2)}\n`);
  });
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  await run;
}

export async function findPiece(id: string): Promise<Piece | undefined> {
  const pieces = await readPieces();
  return pieces.find((piece) => piece.id === id);
}
