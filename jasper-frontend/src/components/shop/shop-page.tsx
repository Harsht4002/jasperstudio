"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/api/categories";
import { getProducts, type ProductQuery } from "@/api/products";
import { Pagination } from "@/components/shop/pagination";
import { ProductGrid } from "@/components/shop/product-grid";
import { ProductsHero } from "@/components/shop/products-hero";
import { ProductsToolbar } from "@/components/shop/products-toolbar";
import { SiteLayout } from "@/layouts/site-layout";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const PAGE_LIMIT = 12;

type ProductState =
  | { status: "loading"; products: Product[]; total: number }
  | { status: "success"; products: Product[]; total: number }
  | { status: "empty"; products: Product[]; total: number }
  | { status: "error"; products: Product[]; total: number };

export function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySlug, setCategorySlug] = useState(searchParams?.get("categorySlug") ?? "");
  const [search, setSearch] = useState(searchParams?.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams?.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams?.get("maxPrice") ?? "");
  const [sortBy, setSortBy] = useState<ProductQuery["sortBy"]>(
    (searchParams?.get("sortBy") as ProductQuery["sortBy"]) ?? "newest"
  );
  const [page, setPage] = useState(Number(searchParams?.get("page") ?? 1));
  const debouncedSearch = useDebouncedValue(search, 400);
  const [productState, setProductState] = useState<ProductState>({
    status: "loading",
    products: [],
    total: 0
  });

  const query = useMemo<ProductQuery>(
    () => ({
      limit: PAGE_LIMIT,
      page,
      sortBy,
      categorySlug,
      search: debouncedSearch,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    }),
    [categorySlug, debouncedSearch, maxPrice, minPrice, page, sortBy]
  );

  const syncUrl = useCallback(
    (nextQuery: ProductQuery) => {
      const params = new URLSearchParams();

      Object.entries(nextQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && !(key === "page" && value === 1)) {
          params.set(key, String(value));
        }
      });

      router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false
      });
    },
    [router]
  );

  const loadProducts = useCallback(() => {
    setProductState((current) => ({ ...current, status: "loading" }));
    syncUrl(query);

    getProducts(query)
      .then((response) => {
        setProductState({
          status: response.data.length ? "success" : "empty",
          products: response.data,
          total: response.total
        });
      })
      .catch(() => {
        setProductState({ status: "error", products: [], total: 0 });
      });
  }, [query, syncUrl]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function clearFilters() {
    setCategorySlug("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(productState.total / PAGE_LIMIT));

  return (
    <SiteLayout>
      <div className="mx-auto my-[60px] w-[calc(100%-2rem)] max-w-[1280px] sm:w-[calc(100%-60px)]">
        <main className="rounded-[32px] bg-surface p-8 md:p-16 lg:p-24 text-forest shadow-2xl shadow-wine/5 border border-wine/10">
          <ProductsHero />
          <ProductsToolbar
            categories={categories}
            categorySlug={categorySlug}
            maxPrice={maxPrice}
            minPrice={minPrice}
            productStatus={productState.status}
            search={search}
            sortBy={sortBy}
            total={productState.total}
            onCategoryChange={(value) => {
              setCategorySlug(value);
              setPage(1);
            }}
            onClearFilters={clearFilters}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
              setPage(1);
            }}
            onMinPriceChange={(value) => {
              setMinPrice(value);
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onSortChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
          />
          <ProductGrid
            onRetry={loadProducts}
            products={productState.products}
            status={productState.status}
          />
          {productState.status === "success" ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </main>
      </div>
    </SiteLayout>
  );
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);

    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}
