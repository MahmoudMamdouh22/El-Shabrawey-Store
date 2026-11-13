import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@elshabrawey.store";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const demoProductSlugs = [
  "course-fullstack",
  "ebook-freelance",
  "notebook-dev",
  "tshirt-code",
  "template-portfolio",
  "mug-coffee",
];

const previewProducts = [
  { slug: "preview-gaming-build", category: "builds", name: "تجميعة ألعاب — نموذج تجريبي", model: "Demo Build A", priceCents: 3500000, condition: "used", warranty: "مثال تجريبي — يحدّد حسب التجميعة", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لترتيب مكونات جهاز كامل", description: "بيانات توضيحية لتجربة صفحة التجميعة. استبدلها ببيانات الكتالوج قبل النشر.", specifications: [{ label: "المعالج", value: "مثال تجريبي" }, { label: "كرت الشاشة", value: "مثال تجريبي" }, { label: "الذاكرة", value: "16GB" }], image: "/products/placeholder.svg" },
  { slug: "preview-graphics-card", category: "graphics-cards", name: "كرت شاشة — نموذج تجريبي", model: "Demo GPU", priceCents: 850000, condition: "used", warranty: "مثال تجريبي — يحدّد حسب القطعة", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لقطعة مستعملة", description: "مثال لتوضيح الموديل والحالة والمواصفات والضمان.", specifications: [{ label: "الذاكرة", value: "8GB" }, { label: "المخارج", value: "HDMI / DisplayPort" }], image: "/products/placeholder.svg" },
  { slug: "preview-motherboard", category: "motherboards", name: "لوحة أم — نموذج تجريبي", model: "Demo Motherboard", priceCents: 420000, condition: "used", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال للوحة أم", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "المقبس", value: "مثال تجريبي" }, { label: "الذاكرة", value: "DDR4" }], image: "/products/placeholder.svg" },
  { slug: "preview-processor", category: "processors", name: "معالج — نموذج تجريبي", model: "Demo CPU", priceCents: 380000, condition: "used", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لمعالج كمبيوتر", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "الأنوية", value: "6" }, { label: "المقبس", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-ram", category: "ram", name: "رامات — نموذج تجريبي", model: "Demo DDR4 Kit", priceCents: 180000, condition: "used", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لرامات كمبيوتر", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "السعة", value: "16GB (2×8GB)" }, { label: "النوع", value: "DDR4" }], image: "/products/placeholder.svg" },
  { slug: "preview-monitor", category: "monitors", name: "شاشة IPS — نموذج تجريبي", model: "Demo Monitor 24", priceCents: 420000, condition: "used", warranty: "مثال تجريبي — حسب حالة الشاشة", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لشاشة مستوردة مستعملة", description: "بيانات تجربة لشاشة؛ يضاف رقم الموديل والحالة الفعلية قبل النشر.", specifications: [{ label: "المقاس", value: "24 بوصة" }, { label: "اللوحة", value: "IPS" }, { label: "الدقة", value: "Full HD" }], image: "/products/placeholder.svg" },
  { slug: "preview-computer-case", category: "computer-cases", name: "كيسة كمبيوتر — نموذج تجريبي", model: "Demo Mid Tower", priceCents: 230000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لكيسة Mid Tower", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "المقاس", value: "Mid Tower" }, { label: "الواجهة", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-storage", category: "storage", name: "وحدة تخزين SSD — نموذج تجريبي", model: "Demo NVMe SSD", priceCents: 150000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لوحدة تخزين", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "السعة", value: "512GB" }, { label: "الواجهة", value: "NVMe" }], image: "/products/placeholder.svg" },
  { slug: "preview-cooler", category: "coolers", name: "مبرد معالج — نموذج تجريبي", model: "Demo CPU Cooler", priceCents: 95000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لمبرد هوائي", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "النوع", value: "هوائي" }, { label: "التوافق", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-power-supply", category: "power-supplies", name: "مزود طاقة — نموذج تجريبي", model: "Demo PSU 650W", priceCents: 240000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لمزود طاقة", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "القدرة", value: "650W" }, { label: "الكفاءة", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-accessories", category: "accessories", name: "كيبورد وماوس — نموذج تجريبي", model: "Demo Keyboard & Mouse", priceCents: 125000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال لإكسسوارات الكمبيوتر", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "الكيبورد", value: "مثال تجريبي" }, { label: "الماوس", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-adapter", category: "adapters", name: "محول USB لاسلكي — نموذج تجريبي", model: "Demo USB Adapter", priceCents: 45000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مثال للمحولات والملحقات", description: "بيانات تجربة وليست عرضًا للبيع.", specifications: [{ label: "الاتصال", value: "USB" }, { label: "التوافق", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-keyboards-mice", category: "keyboards-mice", name: "كيبورد وماوس لاسلكي — نموذج تجريبي", model: "Demo Wireless Combo", priceCents: 60000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "مجموعة لاسلكية تجريبية", description: "بيانات توضيحية لقسم الكيبوردات والماوسات.", specifications: [{ label: "الاتصال", value: "2.4GHz / Bluetooth" }, { label: "الطاقة", value: "بطارية قابلة للشحن" }], image: "/products/placeholder.svg" },
  { slug: "preview-cables-converters", category: "cables-converters", name: "كابل USB-C — نموذج تجريبي", model: "Demo USB-C Cable", priceCents: 15000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "كابل تجريبي", description: "بيانات توضيحية لقسم الكابلات والكونفرتات.", specifications: [{ label: "الوصلة", value: "USB-C" }, { label: "الطول", value: "1 متر" }], image: "/products/placeholder.svg" },
  { slug: "preview-speakers", category: "speakers", name: "سبيكر مكتبي — نموذج تجريبي", model: "Demo Desktop Speaker", priceCents: 35000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "سبيكر تجريبي للكمبيوتر", description: "بيانات توضيحية لقسم السبيكرات.", specifications: [{ label: "الاتصال", value: "USB / AUX" }, { label: "القدرة", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
  { slug: "preview-computer-accessories", category: "computer-accessories", name: "حامل شاشة — نموذج تجريبي", model: "Demo Monitor Stand", priceCents: 25000, condition: "new", warranty: "مثال تجريبي", delivery: "مثال تجريبي — يحدّد حسب المنطقة", shortDesc: "حامل تجريبي للشاشات", description: "بيانات توضيحية لقسم إكسسوارات الكمبيوتر.", specifications: [{ label: "النوع", value: "حامل شاشة" }, { label: "التوافق", value: "مثال تجريبي" }], image: "/products/placeholder.svg" },
];

const previewBrands: Record<string, string> = {
  builds: "AMD",
  "graphics-cards": "Gigabyte",
  motherboards: "ASUS",
  processors: "Intel",
  ram: "Kingston",
  monitors: "Dell",
  "computer-cases": "Cooler Master",
  storage: "Kingston",
  coolers: "DeepCool",
  "power-supplies": "Corsair",
  accessories: "Logitech",
  adapters: "TP-Link",
  "keyboards-mice": "Point",
  "cables-converters": "Hoco",
  speakers: "JBL",
  "computer-accessories": "Dell",
};

const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

if (!tursoUrl || !tursoAuthToken) {
  throw new Error("يجب ضبط TURSO_DATABASE_URL وTURSO_AUTH_TOKEN قبل تشغيل seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: tursoUrl, authToken: tursoAuthToken }),
});
async function main() {
  const previewOnly = process.argv.includes("--preview-only");
  console.log("Using configured Turso database.");
  if (!previewOnly && !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_PASSWORD before seeding the store administrator.");
  }

  if (!previewOnly) {
    await prisma.product.deleteMany({
      where: { slug: { in: demoProductSlugs } },
    });
    console.log("Removed the previous demo products.");
  }

  // لا تُضاف منتجات تجريبية؛ المنتجات الفعلية تُدار من لوحة المتجر.
  if (!previewOnly) console.log("Removed old unrelated demo products.");

  for (const product of previewProducts) {
    const { specifications, image, ...data } = product;
    const sku = `DEMO-${product.slug.replace(/^preview-/, "").toUpperCase()}`;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...data, sku, stockQuantity: 3, brand: previewBrands[product.category], specifications: JSON.stringify(specifications), images: JSON.stringify([image]), active: true, featured: true, isDemo: true, type: "physical" },
      create: { ...data, sku, stockQuantity: 3, brand: previewBrands[product.category], specifications: JSON.stringify(specifications), images: JSON.stringify([image]), active: true, featured: true, isDemo: true, type: "physical" },
    });
  }
  console.log(`Added ${previewProducts.length} clearly marked sample products (one per store category).`);

if (previewOnly) return;

if (!ADMIN_PASSWORD) {
  throw new Error("Set ADMIN_PASSWORD before seeding the store administrator.");
}

const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "admin", passwordHash },
    create: {
      name: "مدير المتجر",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
  });
  console.log("Store administrator is ready: " + ADMIN_EMAIL);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
