import { apiRequest } from "@/api/client";
import type { Category } from "@/types/category";

export function getCategories() {
  return apiRequest<Category[]>("/categories");
}
