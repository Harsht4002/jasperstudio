"use client";

import { useCallback } from "react";
import { getCategories } from "@/api/categories";
import { useApiResource } from "@/hooks/use-api-resource";
import type { Category } from "@/types/category";
import { SectionHeading } from "./section-heading";
import { RevealSection } from "../scroll-reveal";

interface FeaturedCategoryItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  badge: string;
  gradient: string;
  imageUrl?: string;
}

const clientCategories: FeaturedCategoryItem[] = [
  {
    id: "home-essentials",
    name: "Home Essentials",
    slug: "home-essentials",
    tagline: "Crafted pieces for everyday rituals",
    badge: "Category No. 01",
    gradient: "bg-[radial-gradient(ellipse_at_center,rgba(213,149,43,0.25)_0%,rgba(36,60,39,0.92)_85%)]"
  },
  {
    id: "attars",
    name: "Attars",
    slug: "attars",
    tagline: "Traditional fragrance, bottled by hand",
    badge: "Category No. 02",
    gradient: "bg-[radial-gradient(ellipse_at_center,rgba(213,149,43,0.38)_0%,rgba(36,60,39,0.92)_85%)]"
  },
  {
    id: "festive-edit",
    name: "Festive Edit",
    slug: "festive-edit",
    tagline: "Seasonal collections, made for celebration",
    badge: "Category No. 03",
    gradient: "bg-[radial-gradient(ellipse_at_center,rgba(107,30,40,0.38)_0%,rgba(36,60,39,0.92)_85%)]"
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    tagline: "Small details, made to last",
    badge: "Category No. 04",
    gradient: "bg-[radial-gradient(ellipse_at_center,rgba(52,82,55,0.45)_0%,rgba(36,60,39,0.92)_85%)]"
  }
];

const isEmpty = (categories: Category[]) => categories.length === 0;

export function FeaturedCategories() {
  const loadCategories = useCallback(() => getCategories(), []);
  const { result } = useApiResource(loadCategories, isEmpty);

  // If the backend has matching category image data, associate it
  const categoriesWithImages = clientCategories.map((cat) => {
    if (result.status === "success") {
      const match = result.data.find(
        (c) => c.slug.toLowerCase() === cat.slug.toLowerCase() || c.name.toLowerCase() === cat.name.toLowerCase()
      );
      if (match?.imageUrl) {
        return { ...cat, imageUrl: match.imageUrl };
      }
    }
    return cat;
  });

  return (
    <RevealSection className="mx-auto my-[80px] md:my-[120px] w-[calc(100%-2rem)] max-w-[1360px] sm:w-[calc(100%-60px)]">
      <section 
        className="rounded-[24px] bg-[#FAF8F5] p-8 md:p-14 lg:p-18 text-[#243C27] shadow-soft border border-[#243C27]/10" 
        aria-labelledby="categories-title"
      >
        <SectionHeading eyebrow="Curated Collections" title="Featured Categories" />

        {/* Large + Grid Layout (2x2 grid for generous editorial presence) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {categoriesWithImages.map((category) => (
            <a
              className="group relative flex flex-col justify-end min-h-[22rem] md:min-h-[26rem] lg:min-h-[28rem] overflow-hidden rounded-[24px] bg-[#243C27] text-[#F4EEE0] shadow-soft transition-all duration-500 hover:shadow-soft-hover"
              href={`/shop?categorySlug=${category.slug}`}
              key={category.id}
            >
              {/* Background Art Graphics & Gradients */}
              <span
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={
                  category.imageUrl
                    ? { backgroundImage: `url(${category.imageUrl})` }
                    : undefined
                }
              >
                <span className={`absolute inset-0 ${category.gradient} group-hover:opacity-80 transition-opacity duration-300`} />
              </span>

              {/* Decorative Subtle Seal In Background */}
              <div 
                className="pointer-events-none absolute -right-12 -top-12 size-48 opacity-[0.08] rounded-full border-[14px] border-[#F4EEE0] flex items-center justify-center select-none"
                aria-hidden="true"
              >
                <span className="font-brand-title text-6xl font-bold text-[#F4EEE0]">J</span>
              </div>

              {/* Editorial Tile Header & Arrow Indicator */}
              <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-end h-full">
                <span className="font-body text-[0.7rem] font-medium uppercase tracking-[0.25em] text-[#D5952B] mb-2 opacity-95">
                  {category.badge}
                </span>

                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F4EEE0] tracking-tight group-hover:text-[#D5952B] transition-colors duration-300">
                  {category.name}
                </h3>

                <p className="mt-2 font-body text-sm sm:text-base text-[#F4EEE0]/85 font-normal max-w-md">
                  {category.tagline}
                </p>
                
                <div className="mt-6 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#D5952B] group-hover:text-[#F4EEE0] transition-colors">
                  <span>Explore Collection</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </RevealSection>
  );
}
