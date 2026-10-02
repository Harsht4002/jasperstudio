import { apiRequest } from "@/api/client";
import type { PaginatedResponse } from "@/types/api";
import type { Product } from "@/types/product";

export type ProductQuery = {
  limit?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
  categorySlug?: string;
  search?: string;
  page?: number;
  minPrice?: number;
  maxPrice?: number;
};

export function getProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();

  // enforce sane defaults on client side
  const page = query.page ?? 1;
  const limit = query.limit ?? 24;

  Object.entries({ ...query, page, limit }).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<PaginatedResponse<Product>>(`/products${suffix}`);
}

export function getProductBySlug(slug: string) {
  return apiRequest<Product>(`/products/${slug}`);
}
