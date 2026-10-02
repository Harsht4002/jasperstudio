"use client";

import { useCallback } from "react";
import { getProducts } from "@/api/products";
import { ProductCard } from "@/components/product-card";
import { useApiResource } from "@/hooks/use-api-resource";
import type { PaginatedResponse } from "@/types/api";
import type { Product } from "@/types/product";
import { SectionHeading } from "./section-heading";

import { RevealSection } from "../scroll-reveal";

const fallbackProducts: Product[] = [
  {
    id: "stoneware-bowl",
    name: "Stoneware Bowl",
    slug: "stoneware-bowl",
    price: 2800,
    category: { id: "bowls", name: "Bowls", slug: "bowls" },
    variants: [{ id: "stoneware-bowl-default", name: "Default" }]
  },
  {
    id: "stacked-cup",
    name: "Stacked Cup",
    slug: "stacked-cup",
    price: 1450,
    category: { id: "cups", name: "Cups", slug: "cups" },
    variants: [{ id: "stacked-cup-default", name: "Default" }]
  },
  {
    id: "studio-vase",
    name: "Studio Vase",
    slug: "studio-vase",
    price: 3900,
    category: { id: "vases", name: "Vases", slug: "vases" },
    variants: [{ id: "studio-vase-default", name: "Default" }]
  },
  {
    id: "serving-plate",
    name: "Serving Plate",
    slug: "serving-plate",
    price: 2200,
    category: { id: "plates", name: "Plates", slug: "plates" },
    variants: [{ id: "serving-plate-default", name: "Default" }]
  }
];

const isEmpty = (response: PaginatedResponse<Product>) => response.data.length === 0;

export function FeaturedProducts() {
  const loadProducts = useCallback(
    () => getProducts({ limit: 4, sortBy: "newest", page: 1 }),
    []
  );
  const { result, refetch } = useApiResource(loadProducts, isEmpty);
  const products = result.status === "success" ? result.data.data : fallbackProducts;

  return (
    <RevealSection className="mx-auto my-[100px] md:my-[140px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 lg:p-18 text-[#243C27] shadow-soft border border-[#243C27]/10" 
        id="shop" 
        aria-labelledby="products-title"
      >
        <div className="flex items-end justify-between gap-4 max-sm:block">
          <SectionHeading eyebrow="Curated Gallery" title="Recent Ceramic Works" />
          <a className="mb-1 inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-widest text-[#243C27] hover:text-[#D5952B] transition-colors max-sm:mt-4" href="/shop">
            <span>Explore Full Catalogue</span>
            <span className="font-normal">&rarr;</span>
          </a>
        </div>

        {result.status === "loading" ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading products">
            {[0, 1, 2, 3].map((item) => (
              <div className="min-h-[26rem] rounded-[24px] animate-pulse bg-[#D5952B]/10" key={item} />
            ))}
          </div>
        ) : null}

        {result.status === "error" ? (
          <div className="mt-6 flex items-center gap-4 text-sm text-[#6B1E28]">
            <p>Products are temporarily using placeholders.</p>
            <button className="btn-secondary px-5 py-2 text-xs font-medium uppercase" type="button" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : null}

        {result.status === "empty" ? <p className="mt-6 text-sm text-[#6B1E28]">No products available in this exhibition.</p> : null}

        {result.status !== "loading" ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-4">
            {products.map((product, index) => (
              <ProductCard index={index} key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>
    </RevealSection>
  );
}
