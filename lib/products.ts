import { prisma } from "@/lib/prisma";
import type { Product } from "@/app/generated/prisma/client";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

// شكل المنتج بعد التجهيز للعرض (الصور اتحوّلت من JSON لمصفوفة)
export type ProductView = {
  id: string;
  slug: string;
  sku: string | null;
  stockQuantity: number | null;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  condition: string;
  specifications: { label: string; value: string }[];
  warranty: string | null;
  delivery: string | null;
  isDemo: boolean;
  shortDesc: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  type: "physical" | "digital";
  images: string[];
  featured: boolean;
  active: boolean;
};

/** يحوّل صف قاعدة البيانات لشكل جاهز للعرض */
export function toProductView(p: Product): ProductView {
  let images: string[] = [];
  let specifications: { label: string; value: string }[] = [];
  try {
    const parsed = JSON.parse(p.images);
    if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === "string");
  } catch {
    images = [];
  }
  try {
    const parsed = JSON.parse(p.specifications);
    if (Array.isArray(parsed)) {
      specifications = parsed.filter(
        (x): x is { label: string; value: string } =>
          x && typeof x.label === "string" && typeof x.value === "string"
      );
    }
  } catch {
    specifications = [];
  }
  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    stockQuantity: p.stockQuantity,
    name: p.name,
    category: p.category,
    brand: p.brand,
    model: p.model,
    condition: p.condition,
    specifications,
    warranty: p.warranty,
    delivery: p.delivery,
    isDemo: p.isDemo,
    shortDesc: p.shortDesc,
    description: p.description,
    priceCents: p.priceCents,
    compareAtCents: p.compareAtCents,
    currency: p.currency,
    type: p.type === "digital" ? "digital" : "physical",
    images,
    featured: p.featured,
    active: p.active,
  };
}

/** كل المنتجات المتاحة للبيع (الأحدث أولاً) */
export async function getActiveProducts(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProductView);
}

/** يبحث في اسم المنتج والموديل والوصف أو اسم القسم. */
export type ProductSearchFilters = {
  categories?: string[];
  brands?: string[];
  price?: string;
};

export async function searchProducts(
  query: string,
  filters: ProductSearchFilters = {}
): Promise<ProductView[]> {
  const term = query.trim().slice(0, 100);
  const categories = (filters.categories ?? []).filter((category) =>
    PRODUCT_CATEGORIES.some((entry) => entry.slug === category)
  );
  const brands = (filters.brands ?? []).map((brand) => brand.trim().slice(0, 60)).filter(Boolean);
  const normalizedTerm = term.toLocaleLowerCase("ar");
  const matchingCategories = term
    ? PRODUCT_CATEGORIES
        .filter((category) => category.label.toLocaleLowerCase("ar").includes(normalizedTerm))
        .map((category) => category.slug)
    : [];
  const searchOr = term
    ? [
        { name: { contains: term } },
        { brand: { contains: term } },
        { model: { contains: term } },
        { shortDesc: { contains: term } },
        { description: { contains: term } },
        ...(matchingCategories.length ? [{ category: { in: matchingCategories } }] : []),
      ]
    : undefined;
  const priceWhere =
    filters.price === "under_5000" ? { lte: 500000 } :
    filters.price === "from_5000_to_20000" ? { gt: 500000, lte: 2000000 } :
    filters.price === "from_20000_to_50000" ? { gt: 2000000, lte: 5000000 } :
    filters.price === "over_50000" ? { gt: 5000000 } : undefined;
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      ...(searchOr ? { OR: searchOr } : {}),
      ...(categories.length ? { category: { in: categories } } : {}),
      ...(brands.length ? { brand: { in: brands } } : {}),
      ...(priceWhere ? { priceCents: priceWhere } : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProductView);
}

export async function getActiveProductBrands(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, brand: { not: null } },
    select: { brand: true },
    distinct: ["brand"],
    orderBy: { brand: "asc" },
  });
  return rows.flatMap((row) => row.brand ? [row.brand] : []);
}

/** المنتجات المميزة لصفحة الهبوط */
export async function getFeaturedProducts(limit = 6): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toProductView);
}

/** عناصر الواجهة المميزة أو المعروضة بسعر مخفّض. */
export async function getHomepageHighlights(limit = 4): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      OR: [{ featured: true }, { compareAtCents: { not: null } }],
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows
    .filter((product) => product.featured || (product.compareAtCents != null && product.compareAtCents > product.priceCents))
    .slice(0, limit)
    .map(toProductView);
}

/** الأكثر مبيعًا حسب كميات الطلبات المؤكدة أو التي تم تسليمها. */
export async function getBestSellerProducts(limit = 4): Promise<ProductView[]> {
  const eligibleProducts = await prisma.product.findMany({
    where: { active: true, isDemo: false },
    select: { id: true },
  });
  const eligibleIds = eligibleProducts.map((product) => product.id);
  if (eligibleIds.length === 0) return getPreviewBestSellers(limit);

  const sales = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      productId: { in: eligibleIds },
      order: { is: { status: { in: ["confirmed", "delivered"] } } },
    },
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: limit,
  });
  const ids = sales.map((sale) => sale.productId).filter((id): id is string => id !== null);
  if (ids.length === 0) return getPreviewBestSellers(limit);

  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((product) => [product.id, product]));
  return ids.flatMap((id) => {
    const product = byId.get(id);
    return product ? [toProductView(product)] : [];
  });
}

async function getPreviewBestSellers(limit: number): Promise<ProductView[]> {
  const previewProducts = await prisma.product.findMany({
    where: { active: true, isDemo: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return previewProducts.map(toProductView);
}

export async function getProductsByCategory(category: string): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    where: { active: true, category },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toProductView);
}

/** منتج واحد معروض للبيع بالـ slug (لصفحة المنتج) */
export async function getProductBySlug(
  slug: string
): Promise<ProductView | null> {
  const row = await prisma.product.findFirst({
    where: { slug, active: true },
  });
  return row ? toProductView(row) : null;
}

// ===== أدمن (كل المنتجات بما فيها غير المعروضة) =====
export async function getAllProductsAdmin(): Promise<ProductView[]> {
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProductView);
}

export async function getProductByIdAdmin(
  id: string
): Promise<ProductView | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProductView(row) : null;
}

export type ProductInput = {
  slug: string;
  sku: string | null;
  stockQuantity: number | null;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  condition: string;
  specifications: { label: string; value: string }[];
  warranty: string | null;
  delivery: string | null;
  isDemo: boolean;
  shortDesc: string | null;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  type: string;
  images: string[];
  featured: boolean;
  active: boolean;
};

export async function createProduct(input: ProductInput) {
  const { specifications, ...data } = input;
  return prisma.product.create({
    data: {
      ...data,
      images: JSON.stringify(input.images),
      specifications: JSON.stringify(specifications),
    },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const { specifications, ...data } = input;
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      images: JSON.stringify(input.images),
      specifications: JSON.stringify(specifications),
    },
  });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

/** يتأكد إن الـ slug فريد (باستثناء منتج معيّن عند التعديل) */
export async function isSlugTaken(
  slug: string,
  exceptId?: string
): Promise<boolean> {
  const row = await prisma.product.findUnique({
    where: { slug },
    select: { id: true },
  });
  return !!row && row.id !== exceptId;
}

/** يتحقق من عدم استخدام رمز SKU في منتج آخر. */
export async function isSkuTaken(sku: string, exceptId?: string): Promise<boolean> {
  const row = await prisma.product.findUnique({ where: { sku }, select: { id: true } });
  return !!row && row.id !== exceptId;
}
