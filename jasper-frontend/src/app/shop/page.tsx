import { Suspense } from "react";
import { ShopPage } from "@/components/shop/shop-page";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream px-4 py-24 text-wine">Loading shop...</div>}>
      <ShopPage />
    </Suspense>
  );
}
