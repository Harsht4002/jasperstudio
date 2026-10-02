"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  attachAdminProductImage,
  createAdminProduct,
  createSignedProductImageUpload,
  deleteAdminProduct,
  getAdminCategories,
  getAdminOrders,
  getAdminProducts,
  uploadProductImage,
  type AdminOrder,
} from "@/api/admin";
import { AdminLayout } from "@/layouts/admin-layout";
import { ProtectedRoute } from "@/components/admin/protected-route";
import { useAdminAuth } from "@/store/admin-auth-store";
import { formatCurrency } from "@/utils/currency";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  price: string;
  initialStock: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

const blankProductForm: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  price: "",
  initialStock: "0",
  status: "DRAFT",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminDashboardPage() {
  const { admin } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductFormState>(blankProductForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadDashboard = useCallback(async () => {
    setError("");
    setIsLoading(true);

    try {
      const [productResponse, orderResponse, categoryResponse] =
        await Promise.all([
          getAdminProducts(1, 50),
          getAdminOrders(1, 20),
          getAdminCategories(),
        ]);

      setProducts(productResponse.data);
      setProductTotal(productResponse.total);
      setOrders(orderResponse.data);
      setOrderTotal(orderResponse.total);
      setCategories(categoryResponse);
    } catch {
      setError("Unable to load the admin dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const categoryNamesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  function getCategoryName(product: Product) {
    const categoryId = (product as Product & { categoryId?: string }).categoryId;

    if (product.category?.name) {
      return product.category.name;
    }

    return categoryId ? categoryNamesById.get(categoryId) ?? "Unassigned" : "Unassigned";
  }

  function updateForm(nextForm: Partial<ProductFormState>) {
    setForm((current) => ({ ...current, ...nextForm }));
  }

  function handleNameChange(name: string) {
    setForm((current) => ({
      ...current,
      name,
      slug: current.slug ? current.slug : slugify(name),
    }));
  }

  async function handleCreateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const price = Number(form.price);
    const initialStock = Number(form.initialStock);

    if (
      !form.name.trim() ||
      !form.slug.trim() ||
      Number.isNaN(price) ||
      Number.isNaN(initialStock)
    ) {
      setError("Name, slug, price, and stock are required.");
      return;
    }

    setIsSaving(true);

    try {
      const product = await createAdminProduct({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        categoryId: form.categoryId || undefined,
        price,
        initialStock,
        status: form.status,
      });

      if (imageFile) {
        const signedUpload = await createSignedProductImageUpload(imageFile);
        await uploadProductImage(imageFile, signedUpload.signedUrl);
        await attachAdminProductImage(product.id, signedUpload);
      }

      setForm(blankProductForm);
      setImageFile(null);
      setIsModalOpen(false);
      setMessage("Product created.");
      await loadDashboard();
    } catch {
      setError("Unable to create the product.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteProduct(productId: string) {
    setError("");
    setMessage("");

    try {
      await deleteAdminProduct(productId);
      setMessage("Product deleted.");
      await loadDashboard();
    } catch {
      setError("Unable to delete the product.");
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <main className="px-4 py-8 md:px-[3vw] md:py-10">
          <section className="mb-8 border-b border-wine pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase">Admin Dashboard</p>
                <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-6xl">
                  Welcome, {admin?.name ?? "Admin"}
                </h1>
              </div>
              <button
                className="min-h-11 border border-wine px-4 text-xs font-bold uppercase transition-colors hover:bg-wine hover:text-cream"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                + Add Product
              </button>
            </div>
          </section>

          {message ? (
            <p className="mb-5 border border-forest bg-forest/10 p-3 text-sm text-forest">
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="mb-5 border border-wine bg-wine/10 p-3 text-sm text-wine">
              {error}
            </p>
          ) : null}

          <section className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="border border-wine p-5">
              <p className="text-xs font-bold uppercase">Products</p>
              <p className="mt-3 font-display text-5xl font-bold leading-none">
                {isLoading ? "-" : productTotal}
              </p>
            </div>
            <div className="border border-wine p-5">
              <p className="text-xs font-bold uppercase">Orders</p>
              <p className="mt-3 font-display text-5xl font-bold leading-none">
                {isLoading ? "-" : orderTotal}
              </p>
            </div>
          </section>

          <section className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl font-bold uppercase">Products</h2>
              <button
                className="min-h-10 border border-wine px-3 text-xs font-bold uppercase transition-colors hover:bg-wine hover:text-cream"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                + Add Product
              </button>
            </div>

            <div className="overflow-x-auto border border-wine">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-wine text-xs uppercase text-cream">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr className="border-t border-wine/30" key={product.id}>
                      <td className="p-3">
                        {product.images?.[0]?.url ? (
                          <img
                            alt={product.images[0].altText ?? product.name}
                            className="size-14 object-cover"
                            src={product.images[0].url}
                          />
                        ) : (
                          <span className="grid size-14 place-items-center border border-wine/30 text-xs">
                            None
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold">{product.name}</td>
                      <td className="p-3">{getCategoryName(product)}</td>
                      <td className="p-3">
                        {formatCurrency(product.basePrice ?? product.price, product.currency)}
                      </td>
                      <td className="p-3">
                        <button
                          className="border border-wine px-3 py-2 text-xs font-bold uppercase transition-colors hover:bg-wine hover:text-cream"
                          onClick={() => handleDeleteProduct(product.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && products.length === 0 ? (
                    <tr>
                      <td className="p-5 text-center" colSpan={5}>
                        No products yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-3xl font-bold uppercase">
              Recent Orders
            </h2>
            <div className="overflow-x-auto border border-wine">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-wine text-xs uppercase text-cream">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Delivery Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr className="border-t border-wine/30" key={order.id}>
                      <td className="p-3 font-bold">
                        {order.orderNumber ?? order.id.slice(0, 8)}
                      </td>
                      <td className="p-3">
                        <span className="block font-bold">{order.customerName}</span>
                        <span className="text-xs text-wine/70">
                          {order.customerEmail}
                        </span>
                      </td>
                      <td className="p-3 text-xs max-w-[220px] leading-relaxed">
                        {order.shippingAddress1 ? (
                          <>
                            <span className="block font-medium">{order.shippingAddress1}</span>
                            {order.shippingAddress2 ? (
                              <span className="block text-wine/80">{order.shippingAddress2}</span>
                            ) : null}
                            <span className="block text-wine/70">
                              {[order.shippingCity, order.shippingState, order.shippingPostalCode, order.shippingCountry]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </>
                        ) : (
                          <span className="text-wine/50 italic">No address provided</span>
                        )}
                      </td>
                      <td className="p-3">{order.customerPhone ?? "-"}</td>
                      <td className="p-3">
                        {formatCurrency(Number(order.total), order.currency)}
                      </td>
                      <td className="p-3">{order.status.replaceAll("_", " ")}</td>
                    </tr>
                  ))}
                  {!isLoading && orders.length === 0 ? (
                    <tr>
                      <td className="p-5 text-center" colSpan={6}>
                        No orders yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          {isModalOpen ? (
            <div className="fixed inset-0 z-30 grid place-items-center bg-ink/60 px-4 py-8">
              <form
                className="max-h-full w-full max-w-2xl overflow-y-auto border border-wine bg-cream p-5"
                onSubmit={handleCreateProduct}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="font-display text-3xl font-bold uppercase">
                    Add Product
                  </h2>
                  <button
                    className="border border-wine px-3 py-2 text-xs font-bold uppercase"
                    onClick={() => setIsModalOpen(false)}
                    type="button"
                  >
                    Close
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Name
                    <input
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) => handleNameChange(event.target.value)}
                      value={form.name}
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Slug
                    <input
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) => updateForm({ slug: slugify(event.target.value) })}
                      value={form.slug}
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase md:col-span-2">
                    Description
                    <textarea
                      className="min-h-24 border border-wine/40 bg-transparent px-3 py-2 text-base font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) => updateForm({ description: event.target.value })}
                      value={form.description}
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Category
                    <select
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) => updateForm({ categoryId: event.target.value })}
                      value={form.categoryId}
                    >
                      <option value="">Unassigned</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Price
                    <input
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      min="0"
                      onChange={(event) => updateForm({ price: event.target.value })}
                      step="0.01"
                      type="number"
                      value={form.price}
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Stock
                    <input
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      min="0"
                      onChange={(event) => updateForm({ initialStock: event.target.value })}
                      step="1"
                      type="number"
                      value={form.initialStock}
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Image
                    <input
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="min-h-11 border border-wine/40 bg-transparent px-3 py-2 text-sm font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                      type="file"
                    />
                  </label>
                  <label className="grid gap-2 text-xs font-bold uppercase">
                    Status
                    <select
                      className="min-h-11 border border-wine/40 bg-transparent px-3 text-base font-normal normal-case outline-none focus:border-wine"
                      onChange={(event) =>
                        updateForm({
                          status: event.target.value as ProductFormState["status"],
                        })
                      }
                      value={form.status}
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </label>
                </div>

                <button
                  className="mt-5 min-h-12 w-full bg-forest px-5 text-xs font-bold uppercase text-cream disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  {isSaving ? "Saving" : "Create Product"}
                </button>
              </form>
            </div>
          ) : null}
        </main>
      </AdminLayout>
    </ProtectedRoute>
  );
}
