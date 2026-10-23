export const site = {
  name: "VJMDESIGN",
  tagline: "Simple, trendy jewelry at affordable prices.",
  description:
    "Simple, trendy jewelry at affordable prices, from $3 to $15. Necklaces, pendants, bracelets, and changeable charms, made by hand in non-tarnish PVD steel.",
  /** Product prices are item-only; shipping is always charged at checkout. */
  shippingNote: "Shipping extra on every order",
  nav: [
    { href: "/#collection", label: "Collection" },
    { href: "/#window", label: "Window" },
    { href: "/cart", label: "Cart" },
    { href: "/studio", label: "Studio" },
  ],
} as const;
