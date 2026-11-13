"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

type Props = {
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedPrice: string;
  query: string;
};

const PRICE_RANGES = [
  { value: "under_5000", label: "أقل من 5,000 ج.م" },
  { value: "from_5000_to_20000", label: "5,000 – 20,000 ج.م" },
  { value: "from_20000_to_50000", label: "20,000 – 50,000 ج.م" },
  { value: "over_50000", label: "أكثر من 50,000 ج.م" },
];

export default function StoreFilters({
  brands,
  selectedCategories,
  selectedBrands,
  selectedPrice,
  query,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const clearHref = query ? `/store?q=${encodeURIComponent(query)}` : "/store";

  return (
    <>
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls="store-filter-panel-mobile"
        onClick={() => setMobileOpen(true)}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-fg lg:hidden"
      >
        <FilterIcon /> الفلاتر
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 lg:hidden" onKeyDown={(event) => event.key === "Escape" && setMobileOpen(false)}>
          <button
            type="button"
            aria-label="إغلاق الفلاتر"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <aside id="store-filter-panel-mobile" className="absolute inset-y-0 right-0 w-[min(88vw,380px)] overflow-y-auto border-s border-line bg-bg p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-fg"><FilterIcon /><h2>الفلاتر</h2></div>
              <button type="button" aria-label="إغلاق الفلاتر" onClick={() => setMobileOpen(false)} className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg">إغلاق</button>
            </div>
            <FilterOptions
              brands={brands}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedPrice={selectedPrice}
              query={query}
              clearHref={clearHref}
              idSuffix="mobile"
            />
          </aside>
        </div>
      )}

      <aside className="hidden h-fit rounded-2xl border border-line bg-surface p-5 lg:block">
        <div className="mb-5 flex items-center gap-2 font-semibold text-fg"><FilterIcon /><h2>الفلاتر</h2></div>
        <FilterOptions
          brands={brands}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          selectedPrice={selectedPrice}
          query={query}
          clearHref={clearHref}
          idSuffix="desktop"
        />
      </aside>
    </>
  );
}

function FilterOptions({
  brands,
  selectedCategories,
  selectedBrands,
  selectedPrice,
  query,
  clearHref,
  idSuffix,
}: Props & { clearHref: string; idSuffix: "mobile" | "desktop" }) {
  return (
    <form action="/store" method="get" className="space-y-6">
      {query && <input type="hidden" name="q" value={query} />}

      <fieldset>
        <legend className="mb-3 font-bold text-fg">الأقسام</legend>
        <div className="space-y-2 pe-1">
          {PRODUCT_CATEGORIES.map((category) => (
            <label key={category.slug} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-fg">
              <input
                type="checkbox"
                name="category"
                value={category.slug}
                defaultChecked={selectedCategories.includes(category.slug)}
                onChange={(event) => event.currentTarget.form?.requestSubmit()}
                className="h-4 w-4 rounded border-line accent-brand-600"
              />
              {category.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-bold text-fg">الماركات</legend>
        {brands.length ? (
          <div className="space-y-2 pe-1">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-fg">
                <input
                  type="checkbox"
                  name="brand"
                  value={brand}
                  defaultChecked={selectedBrands.includes(brand)}
                  onChange={(event) => event.currentTarget.form?.requestSubmit()}
                  className="h-4 w-4 rounded border-line accent-brand-600"
                />
                {brand}
              </label>
            ))}
          </div>
        ) : (
          <p className="text-xs leading-5 text-muted">ستظهر الماركات هنا عند إضافتها للمنتجات.</p>
        )}
      </fieldset>

      <div>
        <label htmlFor={`price-range-${idSuffix}`} className="mb-3 block font-bold text-fg">نطاق السعر</label>
        <select
          id={`price-range-${idSuffix}`}
          name="price"
          defaultValue={selectedPrice}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none focus:border-brand-500"
        >
          <option value="">كل الأسعار</option>
          {PRICE_RANGES.map((range) => <option key={range.value} value={range.value}>{range.label}</option>)}
        </select>
      </div>

      <Link
        href={clearHref}
        className="block w-full rounded-xl border border-line bg-bg px-4 py-2.5 text-center text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
      >
        مسح الفلاتر
      </Link>
    </form>
  );
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16l-6.5 7.5V19l-3 1v-7.5L4 5Z" />
    </svg>
  );
}
