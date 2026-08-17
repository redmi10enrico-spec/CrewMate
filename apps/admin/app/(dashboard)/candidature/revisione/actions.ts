"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logAdminAction, reviewApplication, type ApplicationStatus } from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

const STATUSES: ApplicationStatus[] = ["pending", "interview", "accepted", "rejected"];

export async function reviewApplicationAction(formData: FormData) {
  const user = await requireAdminUser();
  const applicationId = String(formData.get("application_id") ?? "");
  const statusRaw = String(formData.get("status") ?? "pending");
  const status = STATUSES.includes(statusRaw as ApplicationStatus) ? (statusRaw as ApplicationStatus) : "pending";
  const notes = String(formData.get("notes") ?? "").trim();

  const service = createServiceRoleClient();
  await reviewApplication(service, applicationId, { status, notes: notes || null, reviewedBy: user.id });
  await logAdminAction(service, {
    adminId: user.id,
    action: "review",
    entity: "applications",
    entityId: applicationId,
    diff: { status, notes },
  });

  revalidatePath("/candidature/revisione");
  revalidatePath(`/candidature/revisione/${applicationId}`);
  redirect("/candidature/revisione");
}
