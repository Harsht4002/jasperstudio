import { SectionHeading } from "./section-heading";
import { RevealSection } from "../scroll-reveal";

export function ArtisanStory() {
  return (
    <RevealSection className="mx-auto my-[100px] md:my-[140px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="relative isolate grid min-h-[520px] grid-cols-1 md:grid-cols-12 overflow-hidden rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 lg:p-18 text-[#243C27] shadow-soft border border-[#243C27]/10" 
        id="about" 
        aria-labelledby="story-title"
      >
        {/* Left Column (40%): Artisan Craftsmanship Image Frame */}
        <div className="md:col-span-5 relative min-h-[320px] md:min-h-full overflow-hidden bg-[#F4EEE0] rounded-[20px] p-6 flex items-center justify-center border border-[#243C27]/10" aria-hidden="true">
          <div className="relative aspect-[4/5] w-full max-w-[320px] rounded-t-[45%] bg-[linear-gradient(160deg,#243C27_0%,#3B5B3E_45%,#D5952B_100%)] shadow-soft flex items-center justify-center p-6 text-center">
            <div className="rounded-t-[45%] border border-[#F4EEE0]/30 size-full p-6 flex flex-col items-center justify-center">
              <div className="size-16 rounded-full border border-[#D5952B]/40 flex items-center justify-center mb-3 bg-[#243C27]/50">
                <span className="font-display text-2xl font-semibold text-[#F4EEE0]">J</span>
              </div>
              <span className="font-display text-2xl font-semibold text-[#F4EEE0] tracking-widest uppercase">Jasper</span>
              <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[#D5952B] mt-1">Studio Artisans</span>
            </div>
          </div>
        </div>

        {/* Right Column (60%): Editorial Narrative */}
        <div className="md:col-span-7 relative flex flex-col justify-center px-4 py-6 text-[#243C27] sm:px-8 md:px-12 md:py-8">
          {/* Small embossed seal behind heading (5% opacity) */}
          <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 size-80 opacity-[0.05] rounded-full border-[20px] border-[#243C27] flex items-center justify-center" aria-hidden="true">
            <span className="font-display text-8xl font-bold text-[#243C27]">J</span>
          </div>

          <div className="relative z-10">
            <p className="mb-2 font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B]">
              ABOUT JASPER STUDIO
            </p>
            <h2 id="story-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#243C27] tracking-tight leading-snug">
              Heritage-Inspired &amp; Gathered With Intention
            </h2>

            {/* Thin Gold Divider */}
            <div className="my-6 h-px w-24 bg-[#D5952B]/60" />

            <p className="font-body text-base md:text-lg leading-relaxed text-[#243C27]/85 font-normal">
              Jasper Studio celebrates thoughtful design inspired by timeless Indian aesthetics. Every piece is carefully curated to bring warmth, craftsmanship, and character into everyday living, blending heritage with a clean, contemporary approach. We believe handmade objects carry stories that no mass-produced piece ever could, creating objects that feel personal, intentional, and made to be cherished.
            </p>

            <div className="mt-8 pt-2">
              <a 
                className="btn-primary inline-flex min-h-12 items-center justify-center rounded-[24px] px-8 text-xs font-medium uppercase tracking-widest shadow-soft hover:shadow-soft-hover" 
                href="/shop"
              >
                <span>Discover Our Collection</span>
                <span className="ml-2 font-normal">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}

