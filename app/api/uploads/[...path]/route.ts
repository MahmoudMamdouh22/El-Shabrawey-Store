import { NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";

export const dynamic = "force-dynamic";
export const revalidate = false; // عدم التحقق من الوقت مباشرةً

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    if (!path || path.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    const key = path.join("/");
    const ext = key.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    if (process.env.NETLIFY) {
      const store = getStore({ name: "uploads", consistency: "strong" });
      const data = await store.get(key, { type: "arrayBuffer" });

      if (!data) {
        return new NextResponse("Not found", { status: 404 });
      }

      return new NextResponse(new Uint8Array(data), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse("Not supported locally via API route", { status: 404 });
  } catch (error) {
    console.error("Error serving upload:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
