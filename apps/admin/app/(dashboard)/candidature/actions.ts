"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteApplicationForm,
  deleteApplicationQuestion,
  logAdminAction,
  setApplicationFormEnabled,
  upsertApplicationForm,
  upsertApplicationQuestion,
} from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

export async function saveApplicationForm(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    role_name: String(formData.get("role_name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    is_open: formData.get("is_open") === "on",
    order: Number(formData.get("order") ?? 0),
  };

  const service = createServiceRoleClient();
  const saved = await upsertApplicationForm(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "application_forms",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/candidature");
  redirect(id ? `/candidature/${saved.id}` : "/candidature");
}

export async function deleteApplicationFormAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteApplicationForm(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "application_forms",
    entityId: id,
  });

  revalidatePath("/candidature");
}

export async function toggleApplicationFormAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextEnabled = formData.get("enabled") === "true";

  const service = createServiceRoleClient();
  await setApplicationFormEnabled(service, id, nextEnabled);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "application_forms",
    entityId: id,
    diff: { enabled: nextEnabled },
  });

  revalidatePath("/candidature");
}

const QUESTION_TYPES = ["text", "textarea", "number", "select", "radio", "checkbox"] as const;

export async function addApplicationQuestionAction(formData: FormData) {
  const user = await requireAdminUser();
  const formId = String(formData.get("form_id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const type = QUESTION_TYPES.includes(formData.get("type") as (typeof QUESTION_TYPES)[number])
    ? (formData.get("type") as (typeof QUESTION_TYPES)[number])
    : "text";
  const optionsRaw = String(formData.get("options") ?? "").trim();
  const options = optionsRaw
    ? optionsRaw
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean)
    : null;
  const required = formData.get("required") === "on";
  const order = Number(formData.get("order") ?? 0);

  if (label) {
    const service = createServiceRoleClient();
    const saved = await upsertApplicationQuestion(service, {
      form_id: formId,
      label,
      type,
      options,
      required,
      order,
    });
    await logAdminAction(service, {
      adminId: user.id,
      action: "create",
      entity: "application_questions",
      entityId: saved.id,
      diff: { label, type, options, required, order },
    });
    revalidatePath(`/candidature/${formId}`);
  }

  redirect(`/candidature/${formId}`);
}

export async function deleteApplicationQuestionAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const formId = String(formData.get("form_id") ?? "");

  const service = createServiceRoleClient();
  await deleteApplicationQuestion(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "application_questions",
    entityId: id,
  });

  revalidatePath(`/candidature/${formId}`);
}
