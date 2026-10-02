import { apiRequest } from "@/api/client";
import type { Cart } from "@/types/cart";

export function getCart() {
  return apiRequest<Cart>("/cart", { withCartToken: true });
}

export function addCartItem(input: {
  productId?: string;
  variantId?: string;
  quantity: number;
}) {
  return apiRequest<Cart>("/cart/items", {
    method: "POST",
    body: JSON.stringify(input),
    withCartToken: true
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
    withCartToken: true
  });
}

export function removeCartItem(itemId: string) {
  return apiRequest<Cart>(`/cart/items/${itemId}`, {
    method: "DELETE",
    withCartToken: true
  });
}

export function clearCart() {
  return apiRequest<{ success: boolean }>("/cart", {
    method: "DELETE",
    withCartToken: true
  });
}

