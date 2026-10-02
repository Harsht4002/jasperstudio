"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { addCartItem } from "@/api/cart";
import { getProductBySlug } from "@/api/products";
import { SiteLayout } from "@/layouts/site-layout";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";

type ProductDetailsState =
  | { status: "loading"; product?: undefined }
  | { status: "success"; product: Product }
  | { status: "error"; product?: undefined };

export function ProductDetailsPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const [state, setState] = useState<ProductDetailsState>({ status: "loading" });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [buttonLabel, setButtonLabel] = useState("Add To Cart");

  const loadProduct = useCallback(() => {
    if (!slug) {
      setState({ status: "error" });
      return;
    }

    setState({ status: "loading" });
    getProductBySlug(slug)
      .then((product) => {
        setSelectedImageIndex(0);
        setState({ status: "success", product });
      })
      .catch(() => setState({ status: "error" }));
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const product = state.status === "success" ? state.product : null;
  const images = useMemo(() => product?.images ?? [], [product]);
  const selectedImage = images[selectedImageIndex];
  const price = product ? product.basePrice ?? product.price : 0;

  function handleAddToCart() {
    if (!product) {
      return;
    }

    setButtonLabel("Adding");
    addCartItem({ productId: product.id, quantity })
      .then(() => {
        window.dispatchEvent(new Event("jasper:cart-updated"));
        setButtonLabel("Added");
      })
      .catch(() => setButtonLabel("Try Again"));
  }

  return (
    <SiteLayout>
      <main className="min-h-screen bg-[#F4EEE0] px-4 py-10 text-[#243C27] md:px-[5vw] md:py-16">
        {state.status === "loading" ? (
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div className="min-h-[580px] rounded-[24px] animate-pulse bg-[#D5952B]/10" />
            <div className="space-y-6">
              <div className="h-16 rounded-[24px] animate-pulse bg-[#D5952B]/10" />
              <div className="h-8 w-40 rounded-full animate-pulse bg-[#D5952B]/10" />
              <div className="h-40 rounded-[24px] animate-pulse bg-[#D5952B]/10" />
            </div>
          </div>
        ) : null}

        {state.status === "error" ? (
          <section className="rounded-[24px] border border-[#243C27]/10 bg-[#FAF8F5] p-12 text-center text-[#243C27]">
            <p className="font-display text-3xl font-normal text-[#243C27] mb-4">Catalogue Entry Unavailable</p>
            <button className="btn-primary px-8 py-3 text-xs font-medium uppercase tracking-widest" type="button" onClick={loadProduct}>
              Retry Loading Work
            </button>
          </section>
        ) : null}

        {product ? (
          <>
            <nav className="mb-10 flex flex-wrap items-center gap-2 font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/70" aria-label="Breadcrumbs">
              <a className="hover:text-[#243C27] transition-colors" href="/home">Home</a>
              <span>/</span>
              <a className="hover:text-[#243C27] transition-colors" href="/shop">Catalogue</a>
              <span>/</span>
              <span className="text-[#243C27] font-semibold">{product.name}</span>
            </nav>

            {/* Split Screen Exhibition Catalogue Layout */}
            <section className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
              {/* Left Column: Gallery */}
              <div>
                <div className="group relative min-h-[520px] overflow-hidden rounded-[24px] bg-[#FAF8F5] shadow-soft border border-[#243C27]/10 md:min-h-[640px]">
                  {selectedImage ? (
                    <img
                      alt={selectedImage.alt ?? selectedImage.altText ?? product.name}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={selectedImage.url}
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-[linear-gradient(135deg,#FAF8F5_0%,#EADFC8_100%)] p-8 text-center">
                      <span className="font-display text-2xl font-semibold text-[#243C27]">Jasper Studio</span>
                      <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B] mt-2">Studio Vessel Entry</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4">
                  {(images.length ? images : [{ id: "placeholder", url: "" }]).map((image, index) => (
                    <button
                      className={`relative aspect-square overflow-hidden rounded-[16px] border transition-all ${index === selectedImageIndex ? "border-[#243C27] ring-2 ring-[#243C27]" : "border-[#243C27]/20 opacity-75 hover:opacity-100"}`}
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      type="button"
                    >
                      {image.url ? (
                        <img
                          alt={image.alt ?? image.altText ?? product.name}
                          className="size-full object-cover"
                          src={image.url}
                        />
                      ) : (
                        <span className="flex size-full items-center justify-center bg-[#FAF8F5] font-display text-xs font-semibold text-[#243C27]/50">
                          J
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Catalogue Entry Information */}
              <aside className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-12 shadow-soft border border-[#243C27]/10 md:sticky md:top-24">
                <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-[#D5952B] mb-2 block">
                  {product.category?.name ?? "Handcrafted Work"} • CATALOGUE ENTRY NO. {product.id.slice(0, 4).toUpperCase()}
                </span>
                
                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#243C27] leading-tight tracking-tight">
                  {product.name}
                </h1>
                
                <p className="mt-4 font-body text-2xl font-semibold text-[#243C27]">
                  {formatCurrency(price, product.currency)}
                </p>

                {/* Thin Gold Divider */}
                <div className="my-6 h-px w-full bg-[#243C27]/10" />

                <p className="font-body text-base leading-relaxed text-[#243C27]/85 font-normal">
                  {product.description ?? "A handcrafted studio ceramic piece, shaped individually with raw minerals and custom glazes to reflect natural textures, tactile elegance, and daily ritual."}
                </p>

                <div className="mt-8 border-y border-[#243C27]/10 py-6">
                  <p className="mb-3 font-body text-xs font-medium uppercase tracking-widest text-[#243C27]/80">Edition Quantity</p>
                  <div className="flex w-fit items-center rounded-[24px] border border-[#243C27]/30 bg-[#F4EEE0]">
                    <button
                      className="grid size-11 place-items-center text-lg text-[#243C27] disabled:opacity-40"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                      type="button"
                    >
                      -
                    </button>
                    <span className="grid size-11 place-items-center border-x border-[#243C27]/20 font-body text-sm font-semibold text-[#243C27]">
                      {quantity}
                    </span>
                    <button
                      className="grid size-11 place-items-center text-lg text-[#243C27]"
                      onClick={() => setQuantity((current) => current + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="btn-primary mt-8 w-full py-4 text-xs font-medium uppercase tracking-widest shadow-soft hover:shadow-soft-hover"
                  onClick={handleAddToCart}
                  type="button"
                >
                  {buttonLabel}
                </button>
              </aside>
            </section>

            {/* Spec Sheet & Notes */}
            <section className="mt-16 grid gap-8 rounded-[24px] bg-[#FAF8F5] p-8 md:p-12 shadow-soft border border-[#243C27]/10 md:grid-cols-3">
              <div>
                <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-[#D5952B]">Craftsmanship &amp; Finish</p>
                <p className="font-body text-sm leading-relaxed text-[#243C27]/80">
                  {product.description ?? "Each object is shaped individually in small studio batches. Subtlest variations in tone, weight, and glaze reflect the human hand behind every piece."}
                </p>
              </div>
              <div>
                <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-[#D5952B]">Studio Care Instructions</p>
                <p className="font-body text-sm leading-relaxed text-[#243C27]/80">
                  Hand wash gently using mild soap. Avoid sudden thermal shocks and store in a clean, ventilated space to preserve glaze depth.
                </p>
              </div>
              <div>
                <p className="mb-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-[#D5952B]">Origin &amp; Authenticity</p>
                <p className="font-body text-sm leading-relaxed text-[#243C27]/80">
                  Handcrafted in India by studio artisans. Accompanied by a Jasper Studio seal of studio authenticity.
                </p>
              </div>
            </section>
          </>
        ) : null}
      </main>
    </SiteLayout>
  );
}
