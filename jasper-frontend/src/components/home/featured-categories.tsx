"use client";

import { useCallback } from "react";
import { getCategories } from "@/api/categories";
import { useApiResource } from "@/hooks/use-api-resource";
import type { Category } from "@/types/category";
import { SectionHeading } from "./section-heading";
import { RevealSection } from "../scroll-reveal";

const fallbackCategories: Category[] = [
  { id: "bowls", name: "Bowls", slug: "bowls" },
  { id: "cups", name: "Cups", slug: "cups" },
  { id: "vases", name: "Vases", slug: "vases" }
];

const isEmpty = (categories: Category[]) => categories.length === 0;

export function FeaturedCategories() {
  const loadCategories = useCallback(() => getCategories(), []);
  const { result, refetch } = useApiResource(loadCategories, isEmpty);
  const categories = result.status === "success" ? result.data : fallbackCategories;

  if (result.status === "empty") {
    return null;
  }

  return (
    <RevealSection className="mx-auto my-[100px] md:my-[140px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 lg:p-18 text-[#243C27] shadow-soft border border-[#243C27]/10" 
        aria-labelledby="categories-title"
      >
        <SectionHeading eyebrow="Curated Works" title="Featured Categories" />

        {result.status === "loading" ? (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3" aria-label="Loading categories">
            {[0, 1, 2].map((item) => (
              <div className="min-h-[22rem] rounded-[24px] animate-pulse bg-[#D5952B]/10" key={item} />
            ))}
          </div>
        ) : null}

        {result.status === "error" ? (
          <div className="mt-6 flex items-center gap-4 text-sm text-[#6B1E28]">
            <p>Categories are temporarily using placeholders.</p>
            <button className="btn-secondary px-5 py-2 text-xs font-medium uppercase" type="button" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : null}

        {result.status !== "loading" ? (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {categories.map((category, index) => (
              <a
                className="group relative flex flex-col justify-end min-h-[22rem] md:min-h-[28rem] overflow-hidden rounded-[24px] bg-[#243C27] text-[#F4EEE0] shadow-soft transition-all duration-500 hover:shadow-soft-hover"
                href={`/shop?categorySlug=${category.slug}`}
                key={category.id}
              >
                {/* Background Image / Art Graphics */}
                <span
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={
                    category.imageUrl
                      ? { backgroundImage: `url(${category.imageUrl})` }
                      : undefined
                  }
                >
                  <span
                    className={[
                      "absolute inset-0 bg-[linear-gradient(180deg,rgba(36,60,39,0.1)_0%,rgba(36,60,39,0.85)_100%)] group-hover:opacity-75 transition-opacity duration-300",
                      index === 1
                        ? "bg-[radial-gradient(ellipse_at_center,rgba(213,149,43,0.25)_0%,rgba(36,60,39,0.9)_80%)]"
                        : index === 2
                          ? "bg-[radial-gradient(ellipse_at_center,rgba(107,30,40,0.25)_0%,rgba(36,60,39,0.9)_80%)]"
                          : ""
                    ].join(" ")}
                  />
                </span>

                {/* Editorial Tile Header & Arrow Indicator */}
                <div className="relative z-10 p-8 flex flex-col justify-end h-full">
                  <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-[#D5952B] mb-2 opacity-90">
                    Category No. 0{index + 1}
                  </span>
                  <h3 className="font-display text-3xl font-semibold text-[#F4EEE0] tracking-wide sm:text-4xl group-hover:text-[#D5952B] transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#F4EEE0]/90">
                    <span>Explore Collection</span>
                    <span className="transform transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </section>
    </RevealSection>
  );
}
