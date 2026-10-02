"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, clearCart as apiClearCart, getCart, removeCartItem, updateCartItem } from "@/api/cart";
import type { Cart } from "@/types/cart";

type CartContextValue = {
  cart: Cart | null;
  count: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<Cart | null>;
  addItem: (input: { productId?: string; variantId?: string; quantity: number }) => Promise<Cart>;
  updateQuantity: (itemId: string, quantity: number) => Promise<Cart>;
  removeItem: (itemId: string) => Promise<Cart>;
  clearCart: () => Promise<void>;
  setCount: (count: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyCart = useCallback((updatedCart: Cart) => {
    setCart(updatedCart);
    const nextCount =
      updatedCart.totalItems ??
      updatedCart.items?.reduce((acc, item) => acc + item.quantity, 0) ??
      0;
    setCount(nextCount);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("jasper:cart-updated"));
    }
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      applyCart(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load cart";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applyCart]);

  useEffect(() => {
    fetchCart();
    const handleCartUpdated = () => {
      // Re-sync if triggered elsewhere
      getCart().then(applyCart).catch(() => {});
    };
    window.addEventListener("jasper:cart-updated", handleCartUpdated);
    return () => {
      window.removeEventListener("jasper:cart-updated", handleCartUpdated);
    };
  }, [fetchCart, applyCart]);

  const addItem = useCallback(
    async (input: { productId?: string; variantId?: string; quantity: number }) => {
      const updated = await addCartItem(input);
      applyCart(updated);
      return updated;
    },
    [applyCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const updated = await updateCartItem(itemId, quantity);
      applyCart(updated);
      return updated;
    },
    [applyCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      const updated = await removeCartItem(itemId);
      applyCart(updated);
      return updated;
    },
    [applyCart]
  );

  const clearCart = useCallback(async () => {
    await apiClearCart();
    const emptyCart: Cart = { items: [], totalItems: 0, subtotal: 0 };
    applyCart(emptyCart);
  }, [applyCart]);

  const value = useMemo(
    () => ({
      cart,
      count,
      loading,
      error,
      fetchCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      setCount
    }),
    [cart, count, loading, error, fetchCart, addItem, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartSummary() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartSummary must be used inside CartProvider");
  }

  return context;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

