import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readPaymentProof } from "@/lib/payment-proofs";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { userId: true, proofImage: true },
  });
  if (!order?.proofImage) return new NextResponse("Not found", { status: 404 });
  if (user.role !== "admin" && order.userId !== user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const proof = await readPaymentProof(order.proofImage);
  if (!proof) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(proof.bytes), {
    headers: {
      "Content-Type": proof.contentType,
      "Content-Length": String(proof.bytes.byteLength),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
