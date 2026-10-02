import { apiRequest } from "@/api/client";

export function getCheckoutQuote() {
  return apiRequest<{
    currency: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    pickupOnly: boolean;
    items: Array<{
      cartItemId: string;
      variantId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      hasStock: boolean;
    }>;
  }>("/checkout/quote", {
    method: "POST",
    withCartToken: true,
  });
}

export function createCheckoutSession(payload?: {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  shipping?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}) {
  return apiRequest<{ checkoutUrl: string }>("/checkout/session", {
    method: "POST",
    body: JSON.stringify(payload ?? {}),
    withCartToken: true,
  });
}

export function getCheckoutSession(sessionId: string) {
  return apiRequest<{
    status: string;
    orderNumber: string | null;
    total?: number | null;
    currency?: string;
  }>(`/checkout/session/${sessionId}`, {
    method: "GET",
  });
}
