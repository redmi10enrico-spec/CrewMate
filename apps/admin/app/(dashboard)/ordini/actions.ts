"use server";

import { revalidatePath } from "next/cache";
import { logAdminAction } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { deliverOrder } from "@/lib/delivery";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function redeliverOrderAction(formData: FormData) {
  const user = await requireAdminUser();
  const orderId = String(formData.get("order_id") ?? "");

  const result = await deliverOrder(orderId);

  const service = createServiceRoleClient();
  await logAdminAction(service, {
    adminId: user.id,
    action: "redeliver",
    entity: "orders",
    entityId: orderId,
    diff: result,
  });

  revalidatePath("/ordini");
  revalidatePath(`/ordini/${orderId}`);
}
