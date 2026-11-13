import type { Metadata } from "next";
import CatalogSections from "@/components/CatalogSections";
import ProductGrid from "@/components/ProductGrid";
import ProductSearch from "@/components/ProductSearch";
import StoreFilters from "@/components/StoreFilters";
import { getActiveProductBrands, searchProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المتجر | الشبراوي ستور",
  description: "تصفح أجهزة الكمبيوتر والشاشات وقطع وإكسسوارات الكمبيوتر.",
};

type Props = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    brand?: string | string[];
    price?: string | string[];
  }>;
};

export default async function StorePage({ searchParams }: Props) {
  const params = await searchParams;
  const asList = (value?: string | string[]) => (Array.isArray(value) ? value : value ? [value] : []);
  const query = asList(params.q)[0]?.trim().slice(0, 100) ?? "";
  const selectedCategories = asList(params.category);
  const selectedBrands = asList(params.brand);
  const selectedPrice = asList(params.price)[0] ?? "";
  const [products, brands] = await Promise.all([
    searchProducts(query, { categories: selectedCategories, brands: selectedBrands, price: selectedPrice }),
    getActiveProductBrands(),
  ]);
  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || !!selectedPrice;
  return (
    <>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
          <StoreFilters
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedPrice={selectedPrice}
            query={query}
          />
          <section className="min-w-0">
            <div className="mb-6 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm leading-6 text-amber-800 dark:text-amber-200">
              المنتجات والأسعار الظاهرة حاليًا نماذج تجريبية للمعاينة. راجع السعر والمواصفات الفعلية قبل النشر.
            </div>
            <div className="mb-6">
              <ProductSearch value={query} />
            </div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {query ? `نتائج البحث عن «${query}»` : "المنتجات المتاحة"}
              </p>
              <span className="tnum rounded-full border border-line bg-surface px-3 py-1 text-sm text-muted">{products.length} منتج</span>
            </div>
            {query || hasFilters ? (
              products.length > 0 ? <ProductGrid products={products} /> : (
                <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-10 text-center text-muted">
                  مفيش منتجات مطابقة للفلاتر دي.
                </div>
              )
            ) : (
              <CatalogSections products={products} />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
