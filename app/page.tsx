import Link from "next/link";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getBestSellerProducts, getHomepageHighlights } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [highlights, bestSellers] = await Promise.all([
    getHomepageHighlights(4),
    getBestSellerProducts(4),
  ]);

  return (
    <>
      <Hero />

      <section id="featured" className="scroll-mt-20 bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading
            eyebrow="مختارة لك"
            title="منتجات مميزة وعليها خصم"
            description="تصفّح اختيارات المتجر والعروض المتاحة حاليًا."
          />
          {highlights.length > 0 ? (
            <ProductGrid products={highlights} />
          ) : (
            <EmptyState>سيتم عرض المنتجات المميزة والعروض هنا عند إضافتها للمتجر.</EmptyState>
          )}

          <div className="mt-9 text-center">
            <Link href="/store" className="inline-flex items-center gap-2 rounded-xl bg-brand-gradient px-7 py-3.5 font-bold text-white shadow-lg shadow-brand-600/25 transition-opacity hover:opacity-95">
              كل المنتجات والأقسام <span aria-hidden="true">←</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="best-sellers" className="scroll-mt-20 border-y border-line bg-surface/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <SectionHeading
            eyebrow="BEST SELLER"
            title="الأكثر مبيعًا"
            description={bestSellers.length > 0 && bestSellers.every((product) => product.isDemo)
              ? "معاينة شكل القسم بمنتجات تجريبية؛ سيُرتّب حسب المبيعات المؤكدة بعد بدء الطلبات."
              : "منتجات مرتبة حسب الكميات في الطلبات المؤكدة والمُسلّمة."}
          />
          {bestSellers.length > 0 ? (
            <ProductGrid products={bestSellers} />
          ) : (
            <EmptyState>سيظهر هنا الأكثر مبيعًا بعد تسجيل طلبات مؤكدة وتسليمها.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-extrabold tracking-[0.16em] text-brand-300">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-extrabold text-fg sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-9 text-center text-sm text-muted">
      {children}
    </div>
  );
}
