"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
) {
  await requireAdmin();

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
}
