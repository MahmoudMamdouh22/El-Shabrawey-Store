export const PRODUCT_CATEGORIES = [
  { slug: "builds", label: "تجميعات كاملة", icon: "🖥️" },
  { slug: "graphics-cards", label: "كروت شاشة", icon: "🎮" },
  { slug: "motherboards", label: "لوحات أم", icon: "▦" },
  { slug: "processors", label: "معالجات", icon: "▣" },
  { slug: "ram", label: "رامات", icon: "▤" },
  { slug: "monitors", label: "شاشات", icon: "🖥" },
  { slug: "computer-cases", label: "كيسات كمبيوتر", icon: "▥" },
  { slug: "storage", label: "وحدات تخزين", icon: "▧" },
  { slug: "coolers", label: "مبردات", icon: "❄️" },
  { slug: "power-supplies", label: "مزودات طاقة", icon: "ϟ" },
  { slug: "accessories", label: "إكسسوارات", icon: "⌨️" },
  { slug: "keyboards-mice", label: "كيبوردات وماوسات", icon: "⌨️" },
  { slug: "cables-converters", label: "كابلات وكونفرتات", icon: "🔌" },
  { slug: "speakers", label: "سبيكرات", icon: "🔊" },
  { slug: "computer-accessories", label: "إكسسوارات كمبيوتر", icon: "🖥️" },
  { slug: "adapters", label: "محولات وملحقات", icon: "↔" },
  { slug: "other", label: "منتجات أخرى", icon: "▤" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["slug"] | "other";

export function getCategory(slug: string) {
  return PRODUCT_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export function categoryLabel(slug: string): string {
  return getCategory(slug)?.label ?? "منتجات أخرى";
}
