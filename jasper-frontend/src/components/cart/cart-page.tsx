"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart-store";
import { formatCurrency } from "@/utils/currency";
import type { CartItem } from "@/types/cart";

export function CartPage() {
  const { cart, loading, error, fetchCart, updateQuantity, removeItem, clearCart } = useCart();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const items = cart?.items ?? [];
  const totalItemsCount = cart?.totalItems ?? items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart?.subtotal ?? 0;

  async function handleQuantityChange(item: CartItem, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      handleRemove(item.id);
      return;
    }
    setUpdatingItemId(item.id);
    try {
      await updateQuantity(item.id, newQty);
    } catch {
      // Error handled via store/alert
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleRemove(itemId: string) {
    setUpdatingItemId(itemId);
    try {
      await removeItem(itemId);
    } catch {
      // Error handled
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function handleClearCart() {
    if (confirm("Are you sure you want to clear your cart?")) {
      setIsClearing(true);
      try {
        await clearCart();
      } catch {
        // Error handled
      } finally {
        setIsClearing(false);
      }
    }
  }

  return (
    <div className="mx-auto my-[80px] md:my-[120px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <div className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 lg:p-18 text-[#243C27] shadow-soft border border-[#243C27]/10">
        {/* Cart Header */}
        <header className="mb-10 border-b border-[#243C27]/10 pb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B]">STUDIO CART</p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#243C27]">
                Selected Works
              </h1>
            </div>
            <span className="font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/70">
              {loading ? "Loading..." : `${totalItemsCount} ${totalItemsCount === 1 ? "Piece" : "Pieces"} Selected`}
            </span>
          </div>
        </header>

        {/* Loading State */}
        {loading && !cart && (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex animate-pulse gap-6 rounded-[24px] border border-[#243C27]/10 bg-[#F4EEE0] p-6">
                  <div className="size-28 rounded-[16px] bg-[#D5952B]/10" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-6 w-1/3 rounded-full bg-[#D5952B]/10" />
                    <div className="h-4 w-1/4 rounded-full bg-[#D5952B]/10" />
                    <div className="mt-4 h-8 w-24 rounded-full bg-[#D5952B]/10" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-72 animate-pulse rounded-[24px] border border-[#243C27]/10 bg-[#F4EEE0] p-8" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="my-8 rounded-[24px] border border-[#6B1E28]/20 bg-[#6B1E28]/5 p-8 text-center">
            <p className="mb-4 font-body text-base text-[#6B1E28]">{error}</p>
            <button
              onClick={() => fetchCart()}
              className="btn-primary inline-flex min-h-12 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest shadow-soft"
            >
              Retry Loading Cart
            </button>
          </div>
        )}

        {/* Empty Cart */}
        {!loading && items.length === 0 && (
          <div className="my-16 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#D5952B]/15 text-[#243C27]">
              <span className="font-display text-3xl font-semibold">J</span>
            </div>
            <h2 className="mb-3 font-display text-3xl sm:text-4xl font-normal text-[#243C27]">Your cart is currently empty</h2>
            <p className="mb-8 max-w-md font-body text-base text-[#243C27]/80 leading-relaxed">
              Explore our curated catalogue of new arrivals and featured products.
            </p>
            <Link
              href="/shop"
              className="btn-primary inline-flex min-h-13 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest shadow-soft"
            >
              Explore Catalogue &rarr;
            </Link>
          </div>
        )}

        {/* Cart Content with Clean Cards & Summary */}
        {!loading && items.length > 0 && (
          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Cart Items Cards Section */}
            <section aria-label="Cart Items" className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => {
                  const imageUrl = item.product?.image?.url;
                  const isUpdating = updatingItemId === item.id;
                  const currency = item.product?.currency ?? "USD";

                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-6 rounded-[24px] border border-[#243C27]/10 bg-[#F4EEE0] p-6 shadow-soft transition-all duration-300 sm:flex-row sm:items-center sm:justify-between ${
                        isUpdating ? "opacity-60" : "opacity-100"
                      }`}
                    >
                      {/* Product Image & Title */}
                      <div className="flex items-center gap-6">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="relative size-24 shrink-0 overflow-hidden rounded-[16px] border border-[#243C27]/10 bg-[#FAF8F5] sm:size-28"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.product.image?.altText || item.product.name}
                              className="size-full object-cover object-center transition hover:scale-105"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-[#FAF8F5] text-[#243C27]/40">
                              <span className="font-display text-sm font-semibold">JASPER</span>
                            </div>
                          )}
                        </Link>

                        <div className="space-y-1">
                          <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[#D5952B]">
                            Studio Work
                          </span>
                          <div>
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-display text-2xl font-semibold leading-snug text-[#243C27] hover:text-[#D5952B] transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </div>
                          <p className="font-body text-xs font-semibold text-[#243C27]/80">
                            {formatCurrency(item.unitPrice, currency)} per piece
                          </p>
                        </div>
                      </div>

                      {/* Quantity Selector, Subtotal & Remove */}
                      <div className="flex items-center justify-between gap-6 border-t border-[#243C27]/10 pt-4 sm:border-t-0 sm:pt-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-[24px] border border-[#243C27]/30 bg-[#FAF8F5]">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuantityChange(item, -1)}
                            className="flex size-9 items-center justify-center text-[#243C27] transition hover:bg-[#243C27] hover:text-[#F4EEE0] rounded-l-full disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            &minus;
                          </button>
                          <span className="w-9 text-center font-body text-xs font-semibold text-[#243C27]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuantityChange(item, 1)}
                            className="flex size-9 items-center justify-center text-[#243C27] transition hover:bg-[#243C27] hover:text-[#F4EEE0] rounded-r-full disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            &#43;
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <span className="block font-body text-[0.65rem] font-medium uppercase tracking-widest text-[#243C27]/60">
                            Subtotal
                          </span>
                          <span className="font-body text-lg font-semibold text-[#243C27]">
                            {formatCurrency(item.lineTotal, currency)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-[#6B1E28]/70 transition hover:text-[#6B1E28] disabled:opacity-40"
                          title="Remove item"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <svg className="size-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/shop"
                  className="font-body text-xs font-medium uppercase tracking-widest text-[#243C27] hover:text-[#D5952B] transition-colors"
                >
                  &larr; Continue Cataloging
                </Link>
                <button
                  type="button"
                  disabled={isClearing}
                  onClick={handleClearCart}
                  className="font-body text-xs font-medium uppercase tracking-widest text-[#6B1E28]/70 hover:text-[#6B1E28] transition-colors disabled:opacity-40"
                >
                  {isClearing ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </section>

            {/* Order Summary Section */}
            <aside aria-label="Order Summary" className="h-fit space-y-6">
              <div className="rounded-[24px] border border-[#243C27]/10 bg-[#FAF8F5] p-8 shadow-soft">
                <h2 className="mb-6 border-b border-[#243C27]/10 pb-4 font-display text-3xl font-semibold text-[#243C27]">
                  Order Summary
                </h2>

                <div className="space-y-4 font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-body text-base font-semibold text-[#243C27]">
                      {formatCurrency(subtotal, items[0]?.product?.currency ?? "USD")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Complimentary Shipping</span>
                    <span className="text-[#243C27] font-semibold">Free</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="normal-case text-[#243C27]/60">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-[#243C27]/10 pt-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-semibold text-[#243C27]">Estimated Total</span>
                      <span className="font-body text-2xl font-bold text-[#243C27]">
                        {formatCurrency(subtotal, items[0]?.product?.currency ?? "USD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="btn-primary mt-8 flex min-h-13 w-full items-center justify-center rounded-[24px] px-6 text-xs font-medium uppercase tracking-widest shadow-soft hover:shadow-soft-hover"
                >
                  Proceed to Secure Checkout
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
