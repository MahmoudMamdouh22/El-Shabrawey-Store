import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

export const MAX_PROOF_BYTES = 1024 * 1024;
const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
type ProofMime = keyof typeof MIME_TO_EXT;

export function validateProof(file: File): asserts file is File {
  if (!(file.type in MIME_TO_EXT)) {
    throw new Error("صورة الإثبات لازم تكون JPG أو PNG أو WEBP.");
  }
  if (file.size === 0) throw new Error("ملف الصورة فارغ.");
  if (file.size > MAX_PROOF_BYTES) {
    throw new Error("حجم الصورة أكبر من الحد المسموح (1 ميجابايت).");
  }
}

export async function savePaymentProof(file: File): Promise<string> {
  validateProof(file);
  const ext = MIME_TO_EXT[file.type as ProofMime];
  const key = `payment-proofs/${randomUUID()}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  if (process.env.NETLIFY) {
    await getStore({ name: "payment-proofs", consistency: "strong" }).set(key, arrayBuffer);
  } else {
    const filePath = path.join(process.cwd(), ".private-uploads", key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, Buffer.from(arrayBuffer));
  }
  return key;
}

export async function readPaymentProof(key: string): Promise<{ bytes: Buffer; contentType: ProofMime } | null> {
  const match = /^payment-proofs\/[0-9a-f-]+\.(jpg|png|webp)$/i.exec(key);
  if (!match) return null;
  const contentType = ({ jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const)[match[1].toLowerCase() as "jpg" | "png" | "webp"];
  try {
    if (process.env.NETLIFY) {
      const data = await getStore({ name: "payment-proofs", consistency: "strong" }).get(key, { type: "arrayBuffer" });
      return data ? { bytes: Buffer.from(data), contentType } : null;
    }
    const filePath = path.join(process.cwd(), ".private-uploads", key);
    return { bytes: await readFile(filePath), contentType };
  } catch {
    return null;
  }
}
