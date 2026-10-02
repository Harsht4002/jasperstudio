export function Hero() {
  return (
    <div className="mx-auto my-[80px] md:my-[120px] w-[calc(100%-2rem)] max-w-[1360px] px-0 sm:w-[calc(100%-60px)]">
      <section
        className="relative isolate grid h-auto min-h-[560px] md:min-h-[640px] grid-cols-1 md:grid-cols-12 overflow-hidden rounded-[24px] bg-[#FAF8F5] p-8 sm:p-12 md:p-16 lg:p-20 text-[#243C27] shadow-soft border border-[#243C27]/10"
        id="top"
        aria-labelledby="hero-title"
      >
        {/* Background Embossed Medallion Seal & Ornament */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-[500px] opacity-[0.04] rounded-full border-[30px] border-[#243C27] flex items-center justify-center" aria-hidden="true">
          <span className="font-display text-9xl font-bold text-[#243C27]">J</span>
        </div>

        {/* Left Column: Editorial Typography & Story */}
        <div className="md:col-span-7 flex flex-col justify-center space-y-8 pr-0 md:pr-10 z-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#D5952B]/40 bg-[#D5952B]/10 px-4 py-1">
              <span className="size-1.5 rounded-full bg-[#D5952B]" />
              <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-[#243C27]">
                Heritage & Handcrafted Ceramics
              </span>
            </div>
            <h1 
              id="hero-title" 
              className="font-display text-4xl font-semibold tracking-tight text-[#243C27] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
            >
              Handcrafted Pottery <br />
              <span className="font-normal italic text-[#6B1E28]">&amp; Studio Vessels</span>
            </h1>
          </div>

          <p className="max-w-xl font-body text-base font-normal leading-relaxed text-[#243C27]/80 sm:text-lg">
            Every piece is born from clay, water, and fire—gathered with intention and shaped by dedicated artisans. Discover small-batch ceramics that bring warmth, texture, and quiet elegance into your everyday living.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-2">
            <a
              href="/shop"
              className="btn-primary inline-flex min-h-13 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest shadow-soft hover:shadow-soft-hover"
            >
              <span>Shop Collection</span>
              <span className="ml-2 font-normal transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </a>
            <a
              href="#about"
              className="btn-secondary inline-flex min-h-13 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest"
            >
              Read Our Story
            </a>
          </div>
        </div>

        {/* Right Column: Editorial Exhibition Spread Photograph */}
        <div className="md:col-span-5 relative mt-10 md:mt-0 flex items-center justify-center" aria-hidden="true">
          <div className="relative aspect-[4/5] w-full max-w-[360px] lg:max-w-[400px] overflow-hidden rounded-[24px] bg-[#F4EEE0] p-4 shadow-soft border border-[#243C27]/10 flex flex-col justify-between">
            <div className="relative size-full overflow-hidden rounded-[20px] bg-[linear-gradient(145deg,#243C27_0%,#345237_50%,#D5952B_100%)] flex items-center justify-center">
              {/* Inner Arch Line Ornamentation */}
              <div className="size-[85%] rounded-t-[50%] border border-[#F4EEE0]/25 p-6 flex flex-col items-center justify-between text-center backdrop-blur-[1px]">
                <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#D5952B]">Exhibition Catalogue No. 01</span>
                
                <div className="flex flex-col items-center">
                  <div className="size-16 rounded-full border border-[#D5952B]/40 flex items-center justify-center mb-3 bg-[#243C27]/40">
                    <span className="font-display text-2xl font-semibold text-[#F4EEE0]">J</span>
                  </div>
                  <span className="font-display text-2xl font-semibold text-[#F4EEE0] tracking-wide">Jasper Studio</span>
                </div>

                <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[#F4EEE0]/70">Curated Pottery • Est. 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

