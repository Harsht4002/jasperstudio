"use client";

import Link from "next/link";
import { SiteLayout } from "@/layouts/site-layout";

export default function CancelPage() {
  return (
    <SiteLayout>
      <div className="mx-auto my-[80px] w-[calc(100%-2rem)] max-w-[500px] sm:w-[calc(100%-60px)]">
        <main className="rounded-[32px] bg-surface p-8 py-16 md:p-12 text-center text-forest shadow-2xl shadow-wine/5 border border-wine/10 flex flex-col items-center justify-center space-y-6">
          <div className="size-16 rounded-full bg-wine/10 text-wine flex items-center justify-center" aria-hidden="true">
            <svg className="size-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <div className="space-y-2">
            <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-wine/60">
              Session Cancelled
            </span>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-forest leading-none">
              Payment Cancelled
            </h1>
          </div>

          <p className="font-body text-sm text-wine/80 max-w-sm">
            Your studio checkout session was cancelled and no payment was processed. Your shopping cart remains intact.
          </p>

          <div className="pt-4">
            <Link
              href="/cart"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-forest px-8 text-xs font-bold uppercase tracking-wider text-cream shadow transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold hover:text-forest hover:shadow-lg"
            >
              Return to Cart
            </Link>
          </div>
        </main>
      </div>
    </SiteLayout>
  );
}
