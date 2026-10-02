import type { ProductQuery } from "@/api/products";
import type { Category } from "@/types/category";

export function ProductsToolbar({
  categories,
  categorySlug,
  maxPrice,
  minPrice,
  productStatus,
  search,
  sortBy,
  total,
  onCategoryChange,
  onClearFilters,
  onMaxPriceChange,
  onMinPriceChange,
  onSearchChange,
  onSortChange
}: {
  categories: Category[];
  categorySlug: string;
  maxPrice: string;
  minPrice: string;
  productStatus: string;
  search: string;
  sortBy: ProductQuery["sortBy"];
  total: number;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  onMaxPriceChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: ProductQuery["sortBy"]) => void;
}) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
        <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-[#243C27]/70">
          {productStatus === "loading" ? "Cataloging objects..." : `Showing ${total} Catalogued Works`}
        </p>
        {(categorySlug || search || minPrice || maxPrice || sortBy !== "newest") && (
          <button 
            className="font-body text-xs font-medium uppercase tracking-widest text-[#6B1E28] hover:text-[#D5952B] transition-colors border-b border-[#6B1E28]/40 hover:border-[#D5952B]" 
            type="button" 
            onClick={onClearFilters}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Seamless Horizontal Toolbar (No heavy boxes) */}
      <div className="grid grid-cols-1 gap-6 border-y border-[#243C27]/15 py-6 md:grid-cols-12 md:items-center">
        {/* Search */}
        <div className="md:col-span-5 flex items-center gap-3 border-b border-[#243C27]/20 pb-2 md:border-b-0 md:border-r md:pr-6 md:pb-0">
          <span className="font-body text-xs font-medium uppercase tracking-widest text-[#D5952B]">Search</span>
          <input
            className="w-full bg-transparent font-body text-sm text-[#243C27] placeholder:text-[#243C27]/40 outline-none"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter by piece or texture..."
            type="search"
            value={search}
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-4 flex items-center gap-3 border-b border-[#243C27]/20 pb-2 md:border-b-0 md:border-r md:px-6 md:pb-0">
          <span className="font-body text-xs font-medium uppercase tracking-widest text-[#D5952B]">Category</span>
          <select
            className="w-full bg-transparent font-body text-sm text-[#243C27] outline-none cursor-pointer"
            onChange={(event) => onCategoryChange(event.target.value)}
            value={categorySlug}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-3 flex items-center gap-3 md:pl-6">
          <span className="font-body text-xs font-medium uppercase tracking-widest text-[#D5952B]">Sort</span>
          <select
            className="w-full bg-transparent font-body text-sm text-[#243C27] outline-none cursor-pointer"
            onChange={(event) => onSortChange(event.target.value as ProductQuery["sortBy"])}
            value={sortBy}
          >
            <option value="newest">Newest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Pill Category Bar */}
      {categories.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            className={`rounded-full px-5 py-2 font-body text-xs font-medium uppercase tracking-widest transition-all ${
              categorySlug === "" 
                ? "bg-[#243C27] text-[#F4EEE0] shadow-soft" 
                : "border border-[#243C27]/20 text-[#243C27] hover:border-[#243C27]"
            }`}
            onClick={() => onCategoryChange("")}
            type="button"
          >
            All Works
          </button>
          {categories.map((category) => (
            <button
              className={`rounded-full px-5 py-2 font-body text-xs font-medium uppercase tracking-widest transition-all ${
                categorySlug === category.slug 
                  ? "bg-[#243C27] text-[#F4EEE0] shadow-soft" 
                  : "border border-[#243C27]/20 text-[#243C27] hover:border-[#243C27]"
              }`}
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
