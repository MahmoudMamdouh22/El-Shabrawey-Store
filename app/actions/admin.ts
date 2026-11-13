"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { saveImage } from "@/lib/upload";
import { updateOrderStatus } from "@/lib/orders";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  isSlugTaken,
  isSkuTaken,
  type ProductInput,
} from "@/lib/products";
import { cleanStr, isNonEmpty } from "@/lib/validation";
import { PRODUCT_CATEGORIES } from "@/lib/categories";

// ===== الطلبات =====
export async function setOrderStatusAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = cleanStr(formData.get("orderId"), 40);
  const status = cleanStr(formData.get("status"), 20);
  if (!id || !ORDER_STATUSES.includes(status as OrderStatus)) return;
  await updateOrderStatus(id, status as OrderStatus);
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

// ===== المنتجات =====
export type ProductFormState = { error?: string };

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // أي رمز غير حرف/رقم → شرطة
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function egpToCents(v: string): number | null {
  const n = Number(v.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

async function parseProductForm(
  formData: FormData,
  exceptId?: string
): Promise<{ data?: ProductInput; error?: string }> {
  const name = cleanStr(formData.get("name"), 120);
  if (!isNonEmpty(name, 2)) return { error: "اكتب اسم المنتج." };

  let slug = cleanStr(formData.get("slug"), 80);
  if (!slug) slug = slugify(name);
  else slug = slugify(slug);
  if (!slug) return { error: "الـ slug غير صالح، جرّب اسم تاني." };
  if (await isSlugTaken(slug, exceptId))
    return { error: `الـ slug "${slug}" مستخدم بالفعل، غيّره.` };

  const skuValue = cleanStr(formData.get("sku"), 50).toUpperCase();
  const sku = skuValue || null;
  if (sku && !/^[A-Z0-9][A-Z0-9._/-]{0,49}$/.test(sku))
    return { error: "رمز SKU يقبل الحروف الإنجليزية والأرقام والشرطة والنقطة فقط." };
  if (sku && await isSkuTaken(sku, exceptId))
    return { error: `رمز SKU "${sku}" مستخدم بالفعل.` };

  const stockRaw = cleanStr(formData.get("stockQuantity"), 12);
  const stockNumber = stockRaw === "" ? null : Number(stockRaw);
  if (stockNumber !== null && (!Number.isInteger(stockNumber) || stockNumber < 0))
    return { error: "كمية المخزون لازم تكون عددًا صحيحًا صفر أو أكبر." };

  const priceCents = egpToCents(cleanStr(formData.get("price"), 20));
  if (priceCents === null) return { error: "السعر غير صحيح." };

  const compareRaw = cleanStr(formData.get("compareAt"), 20);
  const compareAtCents = compareRaw ? egpToCents(compareRaw) : null;
  if (compareRaw && compareAtCents === null)
    return { error: "السعر قبل الخصم غير صحيح." };

  const type = "physical";
  const category = cleanStr(formData.get("category"), 40);
  if (!PRODUCT_CATEGORIES.some((item) => item.slug === category))
    return { error: "اختار قسمًا صحيحًا للمنتج." };
  const model = cleanStr(formData.get("model"), 120) || null;
  const brand = cleanStr(formData.get("brand"), 80) || null;
  const conditionValue = cleanStr(formData.get("condition"), 20);
  const condition = ["new", "used", "refurbished"].includes(conditionValue)
    ? conditionValue
    : "new";
  const specifications = cleanStr(formData.get("specifications"), 4000)
    .split(/\r?\n/)
    .map((line) => {
      const colon = line.indexOf(":");
      return colon > 0
        ? { label: line.slice(0, colon).trim(), value: line.slice(colon + 1).trim() }
        : null;
    })
    .filter((item): item is { label: string; value: string } => !!item?.label && !!item.value);
  const warranty = cleanStr(formData.get("warranty"), 120) || null;
  const delivery = cleanStr(formData.get("delivery"), 160) || null;
  const isDemo = formData.get("isDemo") === "on";
  const shortDesc = cleanStr(formData.get("shortDesc"), 160) || null;
  const description = cleanStr(formData.get("description"), 4000);
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";
  if (active && stockNumber === null)
    return { error: "حدد كمية المخزون قبل عرض المنتج للبيع، أو أخفِه حتى تتأكد من الكمية." };

  // الصور: رابط لكل سطر + صورة مرفوعة (اختياري)
  const urls = cleanStr(formData.get("imageUrls"), 4000)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const images: string[] = [];
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      images.push(await saveImage(file, "products"));
    } catch (e) {
      return { error: e instanceof Error ? e.message : "فشل رفع الصورة." };
    }
  }
  images.push(...urls);

  return {
    data: {
      slug,
      sku,
      stockQuantity: stockNumber,
      name,
      shortDesc,
      description,
      priceCents,
      compareAtCents,
      type,
      category,
      model,
      brand,
      condition,
      specifications,
      warranty,
      delivery,
      isDemo,
      images,
      featured,
      active,
    },
  };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const { data, error } = await parseProductForm(formData);
  if (error || !data) return { error };
  await createProduct(data);
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/store");
  revalidatePath(`/store/${data.category}`);
  redirect("/admin/products");
}

export async function updateProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const id = cleanStr(formData.get("id"), 40);
  if (!id) return { error: "منتج غير معروف." };
  const { data, error } = await parseProductForm(formData, id);
  if (error || !data) return { error };
  await updateProduct(id, data);
  revalidatePath("/admin/products");
  revalidatePath(`/products/${data.slug}`);
  revalidatePath("/");
  revalidatePath("/store");
  revalidatePath(`/store/${data.category}`);
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = cleanStr(formData.get("id"), 40);
  if (id) {
    await deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
}
