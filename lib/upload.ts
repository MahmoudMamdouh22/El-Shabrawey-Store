import "server-only";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
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

  if (process.env.NETLIFY) {
    // نستخدم Netlify Blobs للإنتاج
    const store = getStore({ name: "uploads", consistency: "strong" });
    await store.set(key, arrayBuffer);
    // نرجع مسار بيبدأ بـ /api/uploads عشان نخدمه من الـ Blobs
    return `/api/uploads/${key}`;
  } else {
    // نستخدم التخزين المحلي للتطوير
    const dir = path.join(process.cwd(), "public", "uploads", subdir);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), Buffer.from(arrayBuffer));
    return `/uploads/${subdir}/${filename}`;
  }
}
