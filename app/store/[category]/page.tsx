import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGrid from "@/components/ProductGrid";
import { getCategory } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.label} | الشبراوي ستور` : "قسم غير موجود" };
}

export default async function StoreCategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = (await getProductsByCategory(slug)).slice(0, 2);

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <nav className="mb-5 text-sm text-muted"><Link href="/store" className="hover:text-brand-300">المتجر</Link><span className="mx-2">/</span><span className="text-fg">{category.label}</span></nav>
        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-fg"><span>{category.icon}</span>{category.label}</h1>
          <p className="mt-2 text-muted">نماذج محدودة للمعاينة، بحد أقصى منتجين في القسم.</p>
        </div>
        {products.length ? <ProductGrid products={products} /> : (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="font-bold text-fg">القسم قيد التجهيز</p>
            <p className="mt-2 text-sm text-muted">سيتم عرض المنتجات هنا عند إضافتها للمتجر.</p>
          </div>
        )}
      </main>
    </>
  );
}
