import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getActiveProducts } from "@/lib/products";
import { formatPrice, discountLabel } from "@/lib/format";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGrid from "@/components/ProductGrid";
import { categoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "منتج غير موجود" };
  return {
    title: product.name,
    description: product.shortDesc ?? product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? undefined,
      images: product.images.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const discount = discountLabel(product.priceCents, product.compareAtCents);
  

  // منتجات تانية (نستبعد الحالي)
  const others = (await getActiveProducts())
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* مسار التنقّل */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand-300">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href="/store" className="hover:text-brand-300">
          المنتجات
        </Link>
        <span>/</span>
        <Link href={`/store/${product.category}`} className="hover:text-brand-300">
          {categoryLabel(product.category)}
        </Link>
        <span>/</span>
        <span className="text-fg">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* الصور */}
        <ProductGallery images={product.images} alt={product.name} />

        {/* المعلومات */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-600/15 px-3 py-1 text-xs font-bold text-brand-300">
              {categoryLabel(product.category)}
            </span>
            <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg">
              {product.condition === "used" ? "مستعمل" : product.condition === "refurbished" ? "مجدد" : "جديد"}
            </span>
            {product.isDemo && (
              <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold text-slate-950">نموذج تجريبي — السعر والمواصفات للمعاينة</span>
            )}
            {discount && (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                خصم {discount}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-extrabold leading-snug text-fg sm:text-3xl">
            {product.name}
          </h1>

          {product.shortDesc && (
            <p className="mt-2 text-muted">{product.shortDesc}</p>
          )}
          {product.model && (
            <p className="mt-3 text-sm text-muted"><span className="font-bold text-fg">الموديل:</span> {product.model}</p>
          )}
          {product.sku && (
            <p className="mt-2 text-sm text-muted"><span className="font-bold text-fg">SKU:</span> <span dir="ltr" className="font-mono">{product.sku}</span></p>
          )}

          {/* السعر */}
          <div className="mt-5 flex items-end gap-3">
            <span className="tnum text-3xl font-extrabold text-fg">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            {product.compareAtCents && (
              <span className="tnum pb-1 text-lg text-muted line-through">
                {formatPrice(product.compareAtCents, product.currency)}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-surface p-4 text-sm sm:grid-cols-2">
            <div><span className="font-bold text-fg">التوفر:</span> <span className={product.stockQuantity === 0 ? "text-red-300" : product.stockQuantity === null ? "text-amber-300" : "text-emerald-300"}>{product.stockQuantity === null ? "غير محدد" : product.stockQuantity === 0 ? "نفد المخزون" : `متوفر (${product.stockQuantity} قطعة)`}</span></div>
            <div><span className="font-bold text-fg">الحالة:</span> <span className="text-muted">{product.condition === "used" ? "مستعمل" : product.condition === "refurbished" ? "مجدد" : "جديد"}</span></div>
            <div><span className="font-bold text-fg">الضمان:</span> <span className="text-muted">{product.warranty || "يُراجع حسب المنتج"}</span></div>
            <div className="sm:col-span-2"><span className="font-bold text-fg">التوصيل:</span> <span className="text-muted">{product.delivery || "تُحدّد التكلفة والمدة حسب المنطقة"}</span></div>
          </div>

          {product.specifications.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-lg font-bold text-fg">المواصفات</h2>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex items-start justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm">
                    <dt className="font-semibold text-muted">{spec.label}</dt>
                    <dd className="text-left font-bold text-fg">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="my-6 h-px bg-line" />

          {/* الإضافة للسلة */}
          {product.isDemo ? (
            <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-800 dark:text-amber-200">
              هذا عنصر تجريبي للمعاينة فقط ولا يمكن طلبه.
            </p>
          ) : (
            <AddToCartButton product={product} variant="full" />
          )}

          {/* الوصف الكامل */}
          {product.description && (
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-bold text-fg">تفاصيل المنتج</h2>
              <p className="whitespace-pre-line leading-7 text-muted">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* منتجات تانية */}
      {others.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold text-fg">
            منتجات تانية يمكن تعجبك
          </h2>
          <ProductGrid products={others} />
        </section>
      )}
    </div>
  );
}
