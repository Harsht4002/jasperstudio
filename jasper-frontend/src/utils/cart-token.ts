const CART_TOKEN_KEY = "jasper.cartToken";

export function getCartToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CART_TOKEN_KEY);
}

export function persistCartToken(token: string | null) {
  if (typeof window === "undefined" || !token) {
    return;
  }

  window.localStorage.setItem(CART_TOKEN_KEY, token);
}
