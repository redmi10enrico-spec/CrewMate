"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteProductCategory, logAdminAction, upsertProductCategory } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function saveCategory(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };

  const service = createServiceRoleClient();
  const saved = await upsertProductCategory(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "product_categories",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/categorie");
  redirect("/categorie");
}

export async function deleteCategoryAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteProductCategory(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "product_categories",
    entityId: id,
  });

  revalidatePath("/categorie");
}
