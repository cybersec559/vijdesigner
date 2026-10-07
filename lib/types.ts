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
});

export type Piece = z.infer<typeof pieceSchema>;

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
