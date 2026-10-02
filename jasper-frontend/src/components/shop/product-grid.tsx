import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

export function ProductGrid({
  onRetry,
  products,
  status
}: {
  onRetry: () => void;
  products: Product[];
  status: "loading" | "success" | "empty" | "error";
}) {
  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="min-h-[28rem] rounded-[24px] animate-pulse bg-[#D5952B]/10" key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-[24px] border border-[#243C27]/10 bg-[#F4EEE0] p-8 text-center text-[#243C27]">
        <p className="mb-4 font-body text-base">Unable to retrieve catalogue works at this time.</p>
        <button className="btn-primary px-6 py-2.5 text-xs font-medium uppercase tracking-widest" type="button" onClick={onRetry}>
          Retry Cataloging
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="rounded-[24px] border border-[#243C27]/10 bg-[#FAF8F5] p-12 text-center text-[#243C27]">
        <p className="font-display text-2xl font-normal text-[#243C27] mb-2">No Matching Works Found</p>
        <p className="font-body text-sm text-[#243C27]/70">Try clearing your search or category filters to explore the rest of the collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 pb-8">
      {products.map((product, index) => (
        <ProductCard index={index} key={product.id} product={product} />
      ))}
    </div>
  );
}
