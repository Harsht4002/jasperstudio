import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-cream">
      {/* Fixed Background Logo (Layer 2) */}
      <div 
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-[-10] opacity-[0.035] w-[65vw] max-w-[800px] aspect-square flex flex-col items-center justify-center text-center text-wine"
        aria-hidden="true"
      >
        <span className="font-display text-[8vw] md:text-[6.5rem] font-bold uppercase tracking-[0.08em] leading-none">
          JASPER
        </span>
        <span className="font-body text-[3vw] md:text-[2.2rem] font-medium uppercase tracking-[0.3em] mt-3">
          STUDIO
        </span>
      </div>

      <Navbar />
      <div className="relative z-10 w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
}

