import { Suspense } from "react";
import { Metadata } from "next";
import { ShopPage } from "@/components/shop/shop-page";

export const metadata: Metadata = {
  title: "Products | Jasper Studio",
  description: "Browse our collection of handcrafted ceramic products."
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream px-4 py-24 text-wine font-body">Loading products...</div>}>
      <ShopPage />
    </Suspense>
  );
}
