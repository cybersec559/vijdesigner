import { z } from "zod";

export const copySchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40),
  materials: z.string().trim().min(1).max(160),
  story: z.string().trim().min(1).max(800),
  adHeadline: z.string().trim().min(1).max(120),
  adBody: z.string().trim().min(1).max(280),
  socialCaption: z.string().trim().min(1).max(280),
  altText: z.string().trim().min(1).max(240),
});

export type CopyFields = z.infer<typeof copySchema>;

export const pieceSchema = copySchema.extend({
  id: z.string().trim().min(1).max(80),
  image: z
    .string()
    .regex(/^\/uploads\/[A-Za-z0-9._-]+$/, "Image must live in /uploads"),
  createdAt: z.string().min(1),
  price: z.string().trim().min(1).max(40).optional(),
  priceOptions: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        price: z.string().trim().min(1).max(40),
      }),
    )
    .max(10)
    .optional(),
  badge: z.string().trim().min(1).max(30).optional(),
  photos: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(40),
        image: z
          .string()
          .regex(/^\/uploads\/[A-Za-z0-9._\/-]+$/, "Image must live in /uploads"),
        altText: z.string().trim().min(1).max(240),
      }),
    )
    .max(6)
    .optional(),
  variantLabel: z.string().trim().min(1).max(40).optional(),
  variants: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(40),
        swatch: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Swatch must be a hex color"),
        image: z
          .string()
          .regex(/^\/uploads\/[A-Za-z0-9._-]+$/, "Image must live in /uploads"),
        altText: z.string().trim().min(1).max(240),
      }),
    )
    .max(12)
    .optional(),
});

export type Piece = z.infer<typeof pieceSchema>;

const categoryPlurals: Record<string, string> = {
  Earrings: "Earrings",
  Necklace: "Necklaces",
  Pendant: "Pendants",
  Ring: "Rings",
  Bracelet: "Bracelets",
  Craft: "Crafts",
};

const categoryOrder = Object.keys(categoryPlurals);

export function categoryLabel(category: string): string {
  return categoryPlurals[category] ?? category;
}

export function sortedCategories(pieces: Piece[]): string[] {
  const present = [...new Set(pieces.map((piece) => piece.category))];
  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };
  return present.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

export function priceSummary(piece: Piece): string | undefined {
  if (piece.price) {
    return piece.price;
  }
  const first = piece.priceOptions?.[0];
  return first ? `from ${first.price}` : undefined;
}

export const emptyCopy = {
  name: "",
  category: "",
  materials: "",
  story: "",
  adHeadline: "",
  adBody: "",
  socialCaption: "",
  altText: "",
} satisfies CopyFields;
