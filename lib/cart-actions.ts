"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "./shopify";
import {
  ADD_TO_CART_MUTATION,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_MUTATION,
} from "./shopify-queries";
import type { Cart } from "./shopify-types";

const CART_COOKIE = "cartId";

type CartPayload = {
  cart: Cart | null;
  userErrors: { field?: string[] | null; message: string }[];
};

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  if (!raw) {
    return undefined;
  }
  // Cart IDs include ?key=… — encode so cookie parsers do not split on "=".
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, encodeURIComponent(cartId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
}

function assertNoUserErrors(userErrors: CartPayload["userErrors"]) {
  if (userErrors.length) {
    throw new Error(userErrors.map((error) => error.message).join("\n"));
  }
}

export async function getCart(): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) {
    return null;
  }

  const data = await shopifyFetch<{ cart: Cart | null }>(GET_CART_QUERY, {
    cartId,
  });
  return data.cart;
}

export async function createCart(variantId?: string): Promise<Cart> {
  const data = await shopifyFetch<{ cartCreate: CartPayload }>(
    CREATE_CART_MUTATION,
    {
      input: variantId
        ? { lines: [{ merchandiseId: variantId, quantity: 1 }] }
        : {},
    },
  );

  assertNoUserErrors(data.cartCreate.userErrors);
  const cart = data.cartCreate.cart;
  if (!cart) {
    throw new Error("Could not create cart");
  }
  await setCartId(cart.id);
  return cart;
}

export async function addToCart(variantId: string): Promise<Cart> {
  const cartId = await getCartId();
  if (!cartId) {
    return createCart(variantId);
  }

  const data = await shopifyFetch<{ cartLinesAdd: CartPayload }>(
    ADD_TO_CART_MUTATION,
    {
      cartId,
      lines: [{ merchandiseId: variantId, quantity: 1 }],
    },
  );

  assertNoUserErrors(data.cartLinesAdd.userErrors);
  const cart = data.cartLinesAdd.cart;
  if (!cart) {
    return createCart(variantId);
  }
  return cart;
}

export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getCartId();
  if (!cartId) {
    throw new Error("No cart found");
  }

  const data = await shopifyFetch<{ cartLinesUpdate: CartPayload }>(
    UPDATE_CART_MUTATION,
    {
      cartId,
      lines: [{ id: lineId, quantity }],
    },
  );

  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  const cart = data.cartLinesUpdate.cart;
  if (!cart) {
    throw new Error("Could not update cart");
  }
  return cart;
}

export async function removeFromCart(lineId: string): Promise<Cart> {
  const cartId = await getCartId();
  if (!cartId) {
    throw new Error("No cart found");
  }

  const data = await shopifyFetch<{ cartLinesRemove: CartPayload }>(
    REMOVE_FROM_CART_MUTATION,
    {
      cartId,
      lineIds: [lineId],
    },
  );

  assertNoUserErrors(data.cartLinesRemove.userErrors);
  const cart = data.cartLinesRemove.cart;
  if (!cart) {
    throw new Error("Could not remove cart line");
  }
  return cart;
}
