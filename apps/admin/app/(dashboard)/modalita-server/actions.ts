"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteServerMode, logAdminAction, setServerModeEnabled, upsertServerMode } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function saveServerMode(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
  };

  const service = createServiceRoleClient();
  const saved = await upsertServerMode(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "server_modes",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/modalita-server");
  redirect("/modalita-server");
}

export async function deleteServerModeAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteServerMode(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "server_modes",
    entityId: id,
  });

  revalidatePath("/modalita-server");
}

export async function toggleServerModeAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextEnabled = formData.get("enabled") === "true";

  const service = createServiceRoleClient();
  await setServerModeEnabled(service, id, nextEnabled);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "server_modes",
    entityId: id,
    diff: { enabled: nextEnabled },
  });

  revalidatePath("/modalita-server");
}
