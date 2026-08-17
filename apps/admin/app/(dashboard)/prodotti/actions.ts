"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteProduct,
  deleteProductFeature,
  logAdminAction,
  setProductEnabled,
  upsertProduct,
  upsertProductFeature,
} from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function saveProduct(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    category_id: categoryId || null,
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    order: Number(formData.get("order") ?? 0),
    stock: stockRaw ? Number(stockRaw) : null,
  };

  const service = createServiceRoleClient();
  const saved = await upsertProduct(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "products",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/prodotti");
  redirect(id ? `/prodotti/${saved.id}` : "/prodotti");
}

export async function deleteProductAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteProduct(service, id);
  await logAdminAction(service, { adminId: user.id, action: "delete", entity: "products", entityId: id });

  revalidatePath("/prodotti");
}

export async function toggleProductAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextEnabled = formData.get("enabled") === "true";

  const service = createServiceRoleClient();
  await setProductEnabled(service, id, nextEnabled);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "products",
    entityId: id,
    diff: { enabled: nextEnabled },
  });

  revalidatePath("/prodotti");
}

export async function addProductFeatureAction(formData: FormData) {
  const user = await requireAdminUser();
  const productId = String(formData.get("product_id") ?? "");
  const text = String(formData.get("text") ?? "").trim();
  const order = Number(formData.get("order") ?? 0);

  if (text) {
    const service = createServiceRoleClient();
    const saved = await upsertProductFeature(service, { product_id: productId, text, order });
    await logAdminAction(service, {
      adminId: user.id,
      action: "create",
      entity: "product_features",
      entityId: saved.id,
      diff: { text, order },
    });
    revalidatePath(`/prodotti/${productId}`);
  }

  redirect(`/prodotti/${productId}`);
}

export async function deleteProductFeatureAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const productId = String(formData.get("product_id") ?? "");

  const service = createServiceRoleClient();
  await deleteProductFeature(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "product_features",
    entityId: id,
  });

  revalidatePath(`/prodotti/${productId}`);
}
