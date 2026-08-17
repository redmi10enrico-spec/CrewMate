"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteHomeFeature, logAdminAction, setHomeFeatureEnabled, upsertHomeFeature } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function saveHomeFeature(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };

  const service = createServiceRoleClient();
  const saved = await upsertHomeFeature(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "home_features",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/home-features");
  redirect("/home-features");
}

export async function deleteHomeFeatureAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteHomeFeature(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "home_features",
    entityId: id,
  });

  revalidatePath("/home-features");
}

export async function toggleHomeFeatureAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextEnabled = formData.get("enabled") === "true";

  const service = createServiceRoleClient();
  await setHomeFeatureEnabled(service, id, nextEnabled);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "home_features",
    entityId: id,
    diff: { enabled: nextEnabled },
  });

  revalidatePath("/home-features");
}
