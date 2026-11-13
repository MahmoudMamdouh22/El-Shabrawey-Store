import Link from "next/link";
import type { ProductView } from "@/lib/products";
import { PRODUCT_CATEGORIES } from "@/lib/categories";
import ProductGrid from "@/components/ProductGrid";

export default function CatalogSections({ products }: { products: ProductView[] }) {
  const sections = PRODUCT_CATEGORIES.map((category) => ({
    category,
    products: products.filter((product) => product.category === category.slug).slice(0, 2),
  })).filter(({ products: categoryProducts }) => categoryProducts.length > 0);

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
        <p className="text-lg font-bold text-fg">الكتالوج بيتجهّز</p>
        <p className="mt-2 text-sm text-muted">هتظهر المنتجات هنا بمجرد إضافتها من لوحة التحكم.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map(({ category, products: categoryProducts }) => (
        <section key={category.slug} id={category.slug} className="scroll-mt-36">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-extrabold text-fg sm:text-2xl">
                <span aria-hidden="true">{category.icon}</span>{category.label}
              </h3>
              <p className="mt-1 text-sm text-muted">اختيارات متاحة من القسم</p>
            </div>
            <Link href={`/store/${category.slug}`} className="shrink-0 text-sm font-bold text-brand-300 hover:underline">
              عرض القسم ←
            </Link>
          </div>
          <ProductGrid products={categoryProducts} />
        </section>
      ))}
    </div>
  );
}
