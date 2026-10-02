"use client";

import { useState } from "react";
import { addCartItem } from "@/api/cart";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [buttonLabel, setButtonLabel] = useState("Add To Cart");
  const imageUrl = product.images?.[0]?.url;
  const price = product.basePrice ?? product.price;

  const imgProps = imageUrl
    ? { src: imageUrl, alt: product.images?.[0]?.alt || product.name, loading: 'lazy' as const }
    : undefined;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setButtonLabel("Adding...");
    addCartItem({ productId: product.id, quantity: 1 })
      .then(() => {
        window.dispatchEvent(new Event("jasper:cart-updated"));
        setButtonLabel("Added to Cart");
        setTimeout(() => setButtonLabel("Add To Cart"), 2000);
      })
      .catch(() => setButtonLabel("Try Again"));
  }

  // Offset masonry staggering: shift alternate items down on md/lg screens for curated catalog feel
  const offsetClass = index % 2 === 1 ? "md:translate-y-6" : "";

  return (
    <article 
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#FAF8F5] shadow-soft transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-soft-hover ${offsetClass} min-h-[460px] border border-[#243C27]/5`}
    >
      {/* Product Image Container */}
      <a className="relative block aspect-[4/3] w-full overflow-hidden bg-[#F4EEE0]" href={`/products/${product.slug}`}>
        {imgProps ? (
          <img 
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            {...imgProps} 
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-[linear-gradient(135deg,#F4EEE0_0%,#EADFC8_100%)] p-6 text-center">
            <span className="font-display text-lg font-semibold text-[#243C27]/60 tracking-wider">Jasper Studio</span>
            <span className="font-body text-[0.65rem] uppercase tracking-[0.25em] text-[#D5952B] mt-1">Handcrafted Vessel</span>
          </div>
        )}

        {/* Minimal Add To Cart Overlay Button */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button 
            className="btn-primary w-full py-2.5 px-4 text-xs font-medium uppercase tracking-widest shadow-soft" 
            type="button" 
            onClick={handleAddToCart}
          >
            {buttonLabel}
          </button>
        </div>
      </a>

      {/* Product Information */}
      <div className="flex flex-col flex-1 p-6 text-[#243C27]">
        <span className="font-body text-[0.68rem] font-medium uppercase tracking-[0.25em] text-[#D5952B] mb-1">
          {product.category?.name ?? "Handcrafted"}
        </span>
        
        <a href={`/products/${product.slug}`}>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-[#243C27] leading-snug group-hover:text-[#D5952B] transition-colors duration-200">
            {product.name}
          </h3>
        </a>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-[#243C27]/10">
          <span className="font-body text-base font-semibold text-[#243C27]">
            {formatCurrency(price, product.currency)}
          </span>
          <a 
            className="font-body text-[0.7rem] font-medium uppercase tracking-widest text-[#243C27]/80 hover:text-[#D5952B] transition-colors duration-200" 
            href={`/products/${product.slug}`}
          >
            View Entry &rarr;
          </a>
        </div>
      </div>
    </article>
  );
}
