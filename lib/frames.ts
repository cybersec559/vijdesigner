export const frameIds = ["earrings", "pendant", "ring", "bracelet"] as const;

export type FrameId = (typeof frameIds)[number];

type Frame = {
  id: FrameId;
  label: string;
  reference: string;
  prompt: string;
};

const adult =
  "The model is an adult woman in her twenties. Do not depict a child or a teenager.";

export const frames: Record<FrameId, Frame> = {
  earrings: {
    id: "earrings",
    label: "Earrings",
    reference: "blossom-worn.jpg",
    prompt: [
      "The first image is the jewelry to showcase. The second image is the frame.",
      "Replace only the earring with the jewelry from the first image.",
      "Keep the woman, her face, hair, cream silk, soft daylight, background, and the crop at the ear.",
      "The earring must match the uploaded piece in shape, color, and material.",
      adult,
      "No text, no logo, and no extra jewelry.",
    ].join(" "),
  },
  pendant: {
    id: "pendant",
    label: "Pendant",
    reference: "blossom-pendant.jpg",
    prompt: [
      "The first image is the jewelry to showcase. The second image is the frame.",
      "Replace only the necklace with the jewelry from the first image, worn at the throat.",
      "Keep the woman, her face, hair, cream silk, soft daylight, background, and the crop at the collarbone.",
      "The pendant must match the uploaded piece in shape, color, and material.",
      adult,
      "No text, no logo, and no extra jewelry.",
    ].join(" "),
  },
  ring: {
    id: "ring",
    label: "Ring",
    reference: "blossom-worn.jpg",
    prompt: [
      "The first image is the ring to showcase. The second image is only the photographic style: cream silk, soft daylight, a quiet background.",
      "Photograph an adult woman's hand wearing that exact ring. Crop close to the hand.",
      "Do not copy the earring or the face from the second image.",
      "The ring must match the uploaded piece in shape, color, and material.",
      adult,
      "No text, no logo, and no extra jewelry.",
    ].join(" "),
  },
  bracelet: {
    id: "bracelet",
    label: "Bracelet",
    reference: "blossom-pendant.jpg",
    prompt: [
      "The first image is the bracelet to showcase. The second image is only the photographic style: cream silk, soft daylight, a quiet background.",
      "Photograph an adult woman's wrist wearing that exact bracelet. Crop close to the wrist.",
      "Do not copy the pendant or the face from the second image.",
      "The bracelet must match the uploaded piece in shape, color, and material.",
      adult,
      "No text, no logo, and no extra jewelry.",
    ].join(" "),
  },
};

export function isFrameId(value: string): value is FrameId {
  switch (value) {
    case "earrings":
    case "pendant":
    case "ring":
    case "bracelet":
      return true;
    default:
      return false;
  }
}

export function frameForCategory(category: string): FrameId {
  const value = category.toLowerCase();
  if (value.includes("ear")) {
    return "earrings";
  }
  if (value.includes("ring")) {
    return "ring";
  }
  if (
    value.includes("bracelet") ||
    value.includes("cuff") ||
    value.includes("bangle")
  ) {
    return "bracelet";
  }
  if (value.includes("necklace") || value.includes("pendant")) {
    return "pendant";
  }
  return "earrings";
}
