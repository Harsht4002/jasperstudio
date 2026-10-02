import { getCartToken, persistCartToken } from "@/utils/cart-token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

type RequestOptions = RequestInit & {
  withCartToken?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.withCartToken) {
    const cartToken = getCartToken();

    if (cartToken) {
      headers.set("X-Cart-Token", cartToken);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const returnedCartToken = response.headers.get("X-Cart-Token");
  persistCartToken(returnedCartToken);

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
