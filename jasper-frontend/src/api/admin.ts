import { adminApiRequest } from "@/api/admin-auth";
import type { PaginatedResponse } from "@/types/api";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export type AdminOrder = {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  status: string;
  subtotal?: number | string;
  shippingFee?: number | string;
  total: number | string;
  currency?: string;
  shippingAddress1?: string | null;
  shippingAddress2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostalCode?: string | null;
  shippingCountry?: string | null;
  createdAt?: string;
};

export type CreateAdminProductInput = {
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  initialStock?: number;
};

export type SignedUploadResponse = {
  signedUrl: string;
  path: string;
  publicUrl: string;
};

export function getAdminProducts(page = 1, limit = 50) {
  return adminApiRequest<PaginatedResponse<Product>>(
    `/admin/products?page=${page}&limit=${limit}`,
  );
}

export async function getAdminOrders(page = 1, limit = 20) {
  const response = await adminApiRequest<PaginatedResponse<AdminOrder> | AdminOrder[]>(
    `/admin/orders?page=${page}&limit=${limit}`,
  );

  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page,
      limit,
    };
  }

  return response;
}

export function createAdminProduct(input: CreateAdminProductInput) {
  return adminApiRequest<Product>("/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteAdminProduct(productId: string) {
  return adminApiRequest<{ success: boolean }>(`/admin/products/${productId}`, {
    method: "DELETE",
  });
}

export function getAdminCategories() {
  return adminApiRequest<Category[]>("/categories");
}

export function createSignedProductImageUpload(file: File) {
  return adminApiRequest<SignedUploadResponse>("/admin/uploads/signed-url", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  });
}

export async function uploadProductImage(file: File, signedUrl: string) {
  const response = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Image upload failed with ${response.status}`);
  }
}

export function attachAdminProductImage(productId: string, image: SignedUploadResponse) {
  return adminApiRequest(`/admin/products/${productId}/images`, {
    method: "POST",
    body: JSON.stringify({
      path: image.path,
      url: image.publicUrl,
    }),
  });
}
