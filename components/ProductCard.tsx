import Link from "next/link";
import type { ProductView } from "@/lib/products";
import { formatPrice, discountLabel } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import { categoryLabel } from "@/lib/categories";

export default function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] ?? "/products/placeholder.svg";
  const discount = discountLabel(product.priceCents, product.compareAtCents);
  

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:border-brand-600/60 hover:shadow-xl hover:shadow-brand-900/30">
      {/* الصورة */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* الشارات */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <span className="w-fit rounded-full bg-bg/90 px-2.5 py-1 text-xs font-bold text-fg backdrop-blur">
            {product.condition === "used" ? "مستعمل" : product.condition === "refurbished" ? "مجدد" : "جديد"}
          </span>
          {product.isDemo && (
            <span className="w-fit rounded-full bg-amber-500 px-2.5 py-1 text-xs font-extrabold text-slate-950">نموذج تجريبي</span>
          )}
          {discount && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
              {discount}
            </span>
          )}
        </div>
      </Link>

      {/* التفاصيل */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-bold text-brand-300">{categoryLabel(product.category)}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-bold leading-6 text-fg transition-colors group-hover:text-brand-300">
            {product.name}
          </h3>
        </Link>
        {product.shortDesc && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {product.shortDesc}
          </p>
        )}
        {product.sku && (
          <p dir="ltr" className="mt-1 w-fit font-mono text-[11px] text-muted">SKU · {product.sku}</p>
        )}
        {!product.isDemo && product.stockQuantity !== null && product.stockQuantity > 0 && (
          <p className="mt-2 text-xs font-semibold text-emerald-300">
            متوفر — {product.stockQuantity} قطعة
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="flex flex-col">
            <span className="tnum text-lg font-extrabold text-fg">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.compareAtCents && (
              <span className="tnum text-sm text-muted line-through">
                {formatPrice(product.compareAtCents, product.currency)}
              </span>
            )}
          </div>

          {product.isDemo ? (
            <span className="rounded-lg border border-amber-500/40 px-3 py-2 text-center text-xs font-bold text-amber-700 dark:text-amber-200">للمعاينة فقط</span>
          ) : product.stockQuantity === null ? (
            <span className="rounded-lg border border-line px-3 py-2 text-center text-xs font-bold text-muted">التوفر غير محدد</span>
          ) : product.stockQuantity <= 0 ? (
            <span className="rounded-lg border border-red-500/40 px-3 py-2 text-center text-xs font-bold text-red-300">نفد المخزون</span>
          ) : (
            <AddToCartButton product={product} variant="card" />
          )}
        </div>
      </div>
    </div>
  );
}
