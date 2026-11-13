import "server-only";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_MAX = 5 * 1024 * 1024; // 5MB

/** يحفظ صورة مرفوعة ويرجّع المسار العام */
export async function saveImage(
  file: File,
  subdir: string,
  maxBytes = DEFAULT_MAX
): Promise<string> {
  if (!ALLOWED_IMAGE.includes(file.type)) {
    throw new Error("الصورة لازم تكون JPG أو PNG أو WEBP.");
  }
  if (file.size > maxBytes) {
    throw new Error("حجم الصورة كبير (الحد الأقصى 5 ميجا).");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const key = `${subdir}/${filename}`;
  const arrayBuffer = await file.arrayBuffer();

  // دائماً نستخدم Netlify Blobs لضمان التخزين الدائم على Netlify
  const store = getStore({ name: "uploads", consistency: "strong" });
  await store.set(key, arrayBuffer);

  // نرجع مسار يُمكن استدعاؤه عبر API route
  return `/api/uploads/${key}`;
}

/** يحفظ صورة محلية للتطوير فقط (للتوثيق أو الاستخدام غير الإنتاجي) */
export async function saveImageLocal(
  file: File,
  subdir: string,
  maxBytes = DEFAULT_MAX
): Promise<string> {
  if (!ALLOWED_IMAGE.includes(file.type)) {
    throw new Error("الصورة لازم تكون JPG أو PNG أو WEBP.");
  }
  if (file.size > maxBytes) {
    throw new Error("حجم الصورة كبير (الحد الأقصى 5 ميجا).");
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${Date.now()}-${randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  // حفظ مؤقت على القرص المحلي
  const dir = `public/uploads/${subdir}`;
  const fullPath = `${dir}/${filename}`;

  // كتابة الملف على القرص (للتطوير المحلي)
  const fs = await import("node:fs/promises");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, Buffer.from(arrayBuffer));

  return `/uploads/${subdir}/${filename}`;
}
