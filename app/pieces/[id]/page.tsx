import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PieceStory } from "@/components/piece-story";
import { SiteHeader } from "@/components/site-header";
import { findPiece } from "@/lib/pieces";
import { getProductByHandle } from "@/lib/shopify-products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const piece = await findPiece(id);
  if (!piece) {
    return { title: "Piece" };
  }
  return {
    title: piece.name,
    description: piece.adBody,
  };
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const piece = await findPiece(id);
  if (!piece) {
    notFound();
  }

  const product =
    piece.price || piece.priceOptions?.length
      ? await getProductByHandle(piece.id)
      : null;

  return (
    <>
      <SiteHeader />
      <PieceStory piece={piece} product={product} />
    </>
  );
}
