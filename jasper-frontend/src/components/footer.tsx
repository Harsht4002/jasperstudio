export function Footer() {
  return (
    <div className="mx-auto my-[80px] md:my-[120px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <footer
        className="rounded-[24px] bg-[#243C27] px-8 py-16 text-[#F4EEE0] shadow-soft border border-[#243C27]/20"
        id="faq"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo Emblem Section */}
          <a 
            className="flex flex-col items-center gap-3 group" 
            href="/home"
            aria-label="Jasper Studio home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-placeholder.svg"
              alt="Jasper Studio Logo"
              className="size-14 rounded-full object-contain shadow-soft group-hover:scale-105 transition-transform"
            />
            <span className="font-brand-title text-3xl sm:text-4xl tracking-wider text-[#F4EEE0] group-hover:text-[#D5952B] transition-colors">
              Jasper Studio
            </span>
          </a>

          <p className="max-w-md font-body text-sm text-[#F4EEE0]/80 leading-relaxed">
            Thoughtful design inspired by timeless Indian aesthetics. Every piece is carefully curated to bring warmth, craftsmanship, and character into everyday living.
          </p>

          <nav className="flex flex-wrap justify-center gap-8 font-body text-xs font-medium uppercase tracking-[0.2em] text-[#D5952B]">
            <a className="hover:text-[#F4EEE0] transition-colors" href="/shop">Shop Collection</a>
            <a className="hover:text-[#F4EEE0] transition-colors" href="/home#about">About Us</a>
            <a className="hover:text-[#F4EEE0] transition-colors" href="/cart">Cart</a>
          </nav>
        </div>

        {/* Separator and copyright */}
        <div className="mt-12 border-t border-[#D5952B]/30 pt-8 flex flex-col sm:flex-row justify-between items-center font-body text-[0.7rem] font-medium uppercase tracking-widest text-[#F4EEE0]/60 gap-4">
          <span>&copy; {new Date().getFullYear()} Jasper Studio. All rights reserved.</span>
          <span>Gathered, considered, and handmade.</span>
        </div>
      </footer>
    </div>
  );
}

