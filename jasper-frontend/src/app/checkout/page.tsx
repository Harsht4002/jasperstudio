"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SiteLayout } from "@/layouts/site-layout";
import { useCart } from "@/store/cart-store";
import { createCheckoutSession } from "@/api/checkout";
import { formatCurrency } from "@/utils/currency";

const STANDARD_DELIVERY_FEE = 10.0; // $10.00 USD

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingFee = STANDARD_DELIVERY_FEE;
  const total = subtotal + shippingFee;

  // Redirect to products/shop if cart is empty and not loading
  useEffect(() => {
    if (!loading && items.length === 0) {
      router.replace("/shop");
    }
  }, [items, loading, router]);

  async function handleProceedToPayment(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Backend builds checkout session using server-side prices and cartToken
      const response = await createCheckoutSession({});

      if (response && response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error("Could not initialize Stripe Checkout session.");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred initializing payment. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center bg-cream font-body text-wine">
          <p className="text-sm font-semibold uppercase tracking-wider animate-pulse">
            Loading Order Review...
          </p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto my-[80px] md:my-[120px] w-[calc(100%-2rem)] max-w-[1200px] sm:w-[calc(100%-60px)]">
        <main className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 text-[#243C27] shadow-soft border border-[#243C27]/10">
          {/* Header */}
          <header className="mb-10 border-b border-[#243C27]/10 pb-6">
            <p className="font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B] mb-1">
              ORDER REVIEW &amp; CHECKOUT
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#243C27]">
              Finalize Your Order
            </h1>
            <p className="mt-2 font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/70">
              Encrypted Checkout &amp; Delivery Collection via Stripe Gateway (US Only)
            </p>
          </header>

          <form onSubmit={handleProceedToPayment} className="grid gap-12 lg:grid-cols-[1fr_420px]">
            {/* Order Review List (Left Column) */}
            <div className="space-y-8">
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-semibold text-[#243C27] tracking-tight">
                  1. Cart Items ({items.length})
                </h2>
                <div className="space-y-4 rounded-[20px] border border-[#243C27]/10 bg-[#F4EEE0] p-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center justify-between border-b border-[#243C27]/10 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-[12px] bg-[#FAF8F5] flex items-center justify-center font-display font-semibold text-[#243C27] shrink-0 overflow-hidden border border-[#243C27]/10">
                          {item.product?.image?.url ? (
                            <img src={item.product.image.url} alt={item.product.name} className="size-full object-cover" />
                          ) : (
                            "J"
                          )}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-[#243C27] text-base">{item.product?.name}</p>
                          <p className="font-body text-xs text-[#243C27]/70 mt-0.5">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-body font-bold text-[#243C27] text-base">
                        {formatCurrency(item.lineTotal, item.product?.currency ?? "USD")}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Secure Delivery & Payment Information Box */}
              <div className="rounded-[24px] border border-[#243C27]/10 bg-[#F4EEE0] p-6 flex items-start gap-4 text-[#243C27]">
                <div className="size-10 rounded-full bg-[#243C27]/10 flex items-center justify-center shrink-0 mt-1">
                  <svg className="size-5 text-[#243C27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold text-[#243C27] uppercase tracking-wider">
                    Stripe 256-Bit Encrypted Checkout
                  </h3>
                  <p className="font-body text-xs text-[#243C27]/80 mt-1 leading-relaxed">
                    Clicking continue will redirect you to Stripe&apos;s PCI-DSS compliant hosted payment page where you will securely enter your email, US delivery address, and payment details.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary (Right Column) */}
            <aside className="space-y-6">
              <div className="rounded-[24px] border border-[#243C27]/10 bg-[#FAF8F5] p-8 shadow-soft">
                <h2 className="mb-6 border-b border-[#243C27]/10 pb-4 font-display text-3xl font-semibold text-[#243C27]">
                  Payment Summary
                </h2>

                <div className="space-y-4 border-b border-[#243C27]/10 pb-6 font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#243C27]">
                      {formatCurrency(subtotal, items[0]?.product?.currency ?? "USD")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard US Delivery</span>
                    <span className="font-semibold text-[#243C27]">
                      {formatCurrency(shippingFee, items[0]?.product?.currency ?? "USD")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="normal-case text-[#243C27]/60 font-normal">Calculated by Stripe</span>
                  </div>
                </div>

                <div className="pt-4 pb-6 border-b border-[#243C27]/10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#243C27] uppercase tracking-wider">Total</span>
                    <span className="font-body text-3xl font-bold text-[#243C27]">
                      {formatCurrency(total, items[0]?.product?.currency ?? "USD")}
                    </span>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 border border-[#6B1E28]/30 bg-[#6B1E28]/10 p-4 font-body text-xs text-[#6B1E28] font-medium rounded-[16px]">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary mt-6 flex min-h-13 w-full items-center justify-center rounded-[24px] px-6 text-xs font-medium uppercase tracking-widest shadow-soft hover:shadow-soft-hover transition-all"
                >
                  {isSubmitting ? "Redirecting to Stripe..." : "Continue to Secure Payment →"}
                </button>

                <div className="mt-6 text-center">
                  <Link
                    href="/cart"
                    className="font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/70 hover:text-[#D5952B] transition-colors"
                  >
                    &larr; Return to Cart
                  </Link>
                </div>
              </div>
            </aside>
          </form>
        </main>
      </div>
    </SiteLayout>
  );
}
