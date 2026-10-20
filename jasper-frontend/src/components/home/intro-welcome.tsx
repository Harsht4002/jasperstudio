import { RevealSection } from "../scroll-reveal";

export function IntroWelcome() {
  return (
    <RevealSection className="mx-auto my-[40px] md:my-[70px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="relative overflow-hidden rounded-[24px] bg-[#FAF8F5] px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 text-center shadow-soft border border-[#243C27]/10"
        aria-label="Welcome and Studio Philosophy"
      >
        {/* Subtle background seal */}
        <div 
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 opacity-[0.03] rounded-full border-[24px] border-[#243C27] flex items-center justify-center select-none"
          aria-hidden="true"
        >
          <span className="font-brand-title text-9xl font-bold text-[#243C27]">J</span>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5952B]/40 bg-[#D5952B]/10 px-4 py-1">
            <span className="size-1.5 rounded-full bg-[#D5952B]" />
            <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-[#243C27]">
              Welcome to Jasper Studio
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal leading-snug text-[#243C27] tracking-tight">
            Every piece in our studio begins with a maker&apos;s hands, not a machine.
          </h2>

          <div className="mx-auto h-px w-20 bg-[#D5952B]/50 my-6" />

          <p className="font-body text-base sm:text-lg leading-relaxed text-[#243C27]/85 max-w-2xl mx-auto font-normal">
            We work with artisans across India to bring you objects that feel considered, never mass-produced — home essentials, attars, festive wear, and more, made to be lived with, not just looked at.
          </p>
        </div>
      </section>
    </RevealSection>
  );
}
