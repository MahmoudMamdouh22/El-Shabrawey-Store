import "server-only";
import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/lib/payments";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
  "returned",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "قيد المراجعة",
  confirmed: "مؤكّد",
  delivered: "تم التسليم",
  cancelled: "ملغي",
  returned: "مرتجع",
};

export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "delivered"];

export function statusLabel(status: string): string {
  return STATUS_LABELS[status as OrderStatus] ?? status;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(len = 6): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = "ESH-" + randomCode(6);
    const exists = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  return "ESH-" + randomCode(9);
}

export type NewOrderItem = {
  productId: string | null;
  name: string;
  priceCents: number;
  qty: number;
  type: string;
};

export type NewOrderInput = {
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string | null;
  paymentMethod: PaymentMethod;
  proofImage: string | null;
  note: string | null;
  shippingCents: number;
  items: NewOrderItem[];
};

export class StockUnavailableError extends Error {
  constructor(productName: string) {
    super(`المخزون غير كافٍ للمنتج: ${productName}`);
    this.name = "StockUnavailableError";
  }
}

export async function createOrder(input: NewOrderInput) {
  const subtotalCents = input.items.reduce(
    (sum, item) => sum + item.priceCents * item.qty,
    0
  );
  const orderNumber = await generateOrderNumber();

  return prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      if (item.type !== "physical") continue;
      if (!item.productId) throw new StockUnavailableError(item.name);
      const reserved = await tx.product.updateMany({
        where: {
          id: item.productId,
          active: true,
          isDemo: false,
          stockQuantity: { gte: item.qty },
        },
        data: { stockQuantity: { decrement: item.qty } },
      });
      if (reserved.count !== 1) throw new StockUnavailableError(item.name);
    }

    return tx.order.create({
      data: {
        orderNumber,
        userId: input.userId,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail,
        address: input.address,
        paymentMethod: input.paymentMethod,
        proofImage: input.proofImage,
        note: input.note,
        subtotalCents,
        shippingCents: input.shippingCents,
        totalCents: subtotalCents + input.shippingCents,
        status: "pending",
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            priceCents: item.priceCents,
            qty: item.qty,
            type: item.type,
          })),
        },
      },
    });
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new Error("Order not found");

    if (order.status === "cancelled" && status !== "cancelled") {
      for (const item of order.items) {
        if (item.type !== "physical" || !item.productId) continue;
        const reserved = await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: { gte: item.qty } },
          data: { stockQuantity: { decrement: item.qty } },
        });
        if (reserved.count !== 1) throw new StockUnavailableError(item.name);
      }
    } else if (order.status !== "cancelled" && status === "cancelled" && order.status !== "returned") {
      for (const item of order.items) {
        if (item.type !== "physical" || !item.productId) continue;
        await tx.product.updateMany({
          where: { id: item.productId, stockQuantity: { not: null } },
          data: { stockQuantity: { increment: item.qty } },
        });
      }
    }

    return tx.order.update({ where: { id }, data: { status } });
  });
}

export async function getAllOrders(status?: string) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, user: true },
  });
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getStats() {
  const [orders, ordersCount, productsCount, customersCount] = await Promise.all([
    prisma.order.findMany({
      select: { status: true, totalCents: true, subtotalCents: true },
    }),
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.user.count({ where: { role: "customer" } }),
  ]);

  const countStatus = (status: OrderStatus) =>
    orders.filter((order) => order.status === status).length;
  const revenueCents = orders
    .filter((order) => order.status === "confirmed" || order.status === "delivered")
    .reduce((sum, order) => sum + (order.totalCents || order.subtotalCents), 0);

  return {
    ordersCount,
    productsCount,
    customersCount,
    revenueCents,
    pending: countStatus("pending"),
    confirmed: countStatus("confirmed"),
    delivered: countStatus("delivered"),
    cancelled: countStatus("cancelled"),
    returned: countStatus("returned"),
  };
}
