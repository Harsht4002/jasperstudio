"use client";

import { useState, FormEvent } from "react";
import { RevealSection } from "../scroll-reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    // Simulate API request
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1000);
  }

  return (
    <RevealSection className="mx-auto my-[100px] md:my-[140px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="rounded-[24px] bg-[#FAF8F5] p-8 py-16 md:p-16 lg:p-20 text-center text-[#243C27] shadow-soft border border-[#243C27]/10"
        aria-labelledby="newsletter-title"
      >
        <div className="mx-auto max-w-xl space-y-6">
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B]">
            STAY CONNECTED WITH THE STUDIO
          </span>
          <h2 
            id="newsletter-title" 
            className="font-display text-4xl font-normal text-[#243C27] leading-tight sm:text-5xl"
          >
            Studio Gazette &amp; New Work Drops
          </h2>
          <p className="font-body text-base leading-relaxed text-[#243C27]/80">
            Subscribe to receive gentle updates on small-batch pottery drops, private exhibition previews, and craft stories from Jasper Studio.
          </p>

          {status === "success" ? (
            <div className="rounded-[24px] bg-[#243C27]/10 p-5 text-sm font-medium text-[#243C27] border border-[#243C27]/20">
              Thank you for subscribing. We will inform you as soon as our next release opens.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                className="w-full min-h-13 rounded-[24px] border border-[#243C27]/20 bg-[#F4EEE0] px-6 font-body text-sm text-[#243C27] placeholder:text-[#243C27]/50 outline-none focus:border-[#D5952B] focus:ring-1 focus:ring-[#D5952B] transition"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary inline-flex min-h-13 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest shadow-soft shrink-0"
              >
                {status === "submitting" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </section>
    </RevealSection>
  );
}
