"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCart } from "@/api/cart";
import { useCartSummary } from "@/store/cart-store";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/home#about" },
  { label: "FAQ", href: "/home#faq" },
  { label: "Admin Login", href: "/admin/login" }
];

export function Navbar() {
  const { count, setCount } = useCartSummary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const loadShellData = useCallback(() => {
    getCart()
      .then((cart) => {
        const nextCount =
          cart.totalItems ??
          cart.items.reduce((total, item) => total + item.quantity, 0);
        setCount(nextCount);
      })
      .catch(() => setCount(0));
  }, [setCount]);

  useEffect(() => {
    loadShellData();
    window.addEventListener("jasper:cart-updated", loadShellData);

    return () => {
      window.removeEventListener("jasper:cart-updated", loadShellData);
    };
  }, [loadShellData]);

  // Scroll listener for sticky header transition
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial invocation
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 px-4 text-xs font-medium uppercase tracking-widest text-[#243C27] md:px-[5vw] ${
      scrolled 
        ? "border-b border-[#243C27]/10 bg-[#F4EEE0]/85 backdrop-blur-md shadow-soft py-3" 
        : "border-b border-transparent bg-transparent py-5"
    }`}>
      <div className="mx-auto flex items-center justify-between max-w-[1360px]">
        {/* Brand Medallion Logo & Title */}
        <a
          className="flex items-center gap-3 text-xl tracking-normal text-[#243C27] hover:opacity-90 transition-opacity"
          href="/home"
          aria-label="Jasper Studio home"
        >
          <span className="font-brand-title tracking-wider text-2xl text-[#D5952B]">Jasper Studio</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isHomeActive = pathname === "/" || pathname === "/home";
            const isActive = item.href === "/home" 
              ? isHomeActive 
              : pathname === item.href || pathname?.startsWith(item.href);

            return (
              <a 
                className={`border-b-2 py-1 text-xs font-medium tracking-widest transition-all duration-200 ${
                  isActive 
                    ? "border-[#D5952B] text-[#243C27]" 
                    : "border-transparent text-[#243C27]/80 hover:text-[#243C27] hover:border-[#D5952B]/50"
                }`} 
                key={item.href} 
                href={item.href}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Cart & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-full border border-[#243C27]/25 bg-[#243C27]/5 px-4 py-1.5 text-xs font-medium text-[#243C27] transition hover:bg-[#243C27] hover:text-[#F4EEE0]"
            href="/cart"
            aria-label={`Cart with ${count} items`}
          >
            <span aria-hidden="true" className="relative block size-4">
              <span className="absolute bottom-0 left-0 right-0 h-3 rounded-t-xs border-2 border-current" />
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-current" />
            </span>
            <span className="font-semibold">{count}</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-[#243C27] md:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="size-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.75">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <nav className="mt-3 flex flex-col divide-y divide-[#243C27]/10 border-t border-[#243C27]/15 pt-2 md:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              className="py-3 text-xs font-medium uppercase tracking-widest text-[#243C27] hover:text-[#D5952B]"
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

