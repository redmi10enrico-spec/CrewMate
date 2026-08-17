"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAdminAction, upsertSiteSettings } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

const FIELDS = [
  "site_name",
  "server_ip",
  "discord_url",
  "minecraft_version",
  "uptime_label",
  "hero_title",
  "hero_description",
] as const;

export async function saveBranding(formData: FormData) {
  const user = await requireAdminUser();

  const entries: Record<string, string> = {};
  for (const field of FIELDS) {
    entries[field] = String(formData.get(field) ?? "").trim();
  }

  const service = createServiceRoleClient();
  await upsertSiteSettings(service, entries);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "site_settings",
    diff: entries,
  });

  revalidatePath("/branding");
  redirect("/branding?success=1");
}
