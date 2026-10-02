"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteLayout } from "@/layouts/site-layout";
import { getCheckoutSession } from "@/api/checkout";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/shop");
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    async function checkSession() {
      try {
        const response = await getCheckoutSession(sessionId!);
        if (!isMounted) return;

        if (response.status === "paid" && response.orderNumber) {
          setOrderNumber(response.orderNumber);
          setStatus("success");
          
          // Dispatch global event to sync navbar/cart count badge
          window.dispatchEvent(new Event("jasper:cart-updated"));
        } else {
          // Poll every 2 seconds if order is not created yet (give webhook time to write)
          if (pollCountRef.current < 15) {
            pollCountRef.current += 1;
            timerId = setTimeout(checkSession, 2000);
          } else {
            setStatus("error");
          }
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [sessionId, router]);

  return (
    <main className="rounded-[32px] bg-surface p-8 py-16 md:p-12 lg:p-16 text-center text-forest shadow-2xl shadow-wine/5 border border-wine/10 flex flex-col items-center justify-center space-y-8">
      {status === "loading" && (
        <div className="space-y-4">
          <div className="size-16 rounded-full border-4 border-gold border-t-transparent animate-spin mx-auto" />
          <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-forest">
            Securing Your Order...
          </h1>
          <p className="font-body text-sm text-wine/70 max-w-sm mx-auto">
            We are validating your secure payment with Stripe and creating your studio records. This will take a brief moment.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="size-16 rounded-full bg-wine/10 text-wine flex items-center justify-center mx-auto" aria-hidden="true">
            <svg className="size-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-wine">
              Confirmation Pending
            </h1>
            <p className="mt-3 font-body text-sm text-wine/80 max-w-md mx-auto">
              Stripe has processed the payment, but our studio webhook is still writing the records to the database. Please refresh this page or contact us if your order number doesn't appear shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-forest px-8 text-xs font-bold uppercase tracking-wider text-cream shadow transition hover:bg-gold hover:text-forest"
          >
            Refresh Status
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 w-full animate-fade-in">
          <div className="size-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto" aria-hidden="true">
            <svg className="size-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Payment Successful
            </span>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-forest leading-none">
              Thank You
            </h1>
          </div>

          <div className="rounded-2xl border border-wine/10 bg-cream/15 p-6 max-w-sm mx-auto">
            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-wine/60">
              Your Studio Order Number
            </p>
            <p className="font-display text-2xl font-bold text-forest mt-1 tracking-tight">
              {orderNumber}
            </p>
          </div>

          <p className="font-body text-sm text-wine/80 max-w-sm mx-auto">
            A confirmation receipt with your US delivery details has been dispatched.
          </p>

          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-forest px-8 text-xs font-bold uppercase tracking-wider text-cream shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-forest hover:shadow-lg"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SuccessPage() {
  return (
    <SiteLayout>
      <div className="mx-auto my-[80px] w-[calc(100%-2rem)] max-w-[600px] sm:w-[calc(100%-60px)]">
        <Suspense fallback={
          <div className="rounded-[32px] bg-surface p-8 py-16 md:p-12 text-center text-forest shadow-2xl border border-wine/10 flex flex-col items-center justify-center space-y-4">
            <div className="size-16 rounded-full border-4 border-gold border-t-transparent animate-spin" />
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-forest">
              Loading confirmation...
            </h1>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </SiteLayout>
  );
}
