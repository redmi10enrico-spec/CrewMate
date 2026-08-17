"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteForumCategory,
  deletePost,
  deleteThread,
  logAdminAction,
  setThreadLocked,
  setThreadPinned,
  upsertForumCategory,
  type AppRole,
} from "@crewmate/db";
import { requireAdminUser } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/service";

const ROLES: AppRole[] = ["user", "helper", "mod", "admin"];

function parseRole(value: FormDataEntryValue | null): AppRole {
  return ROLES.includes(value as AppRole) ? (value as AppRole) : "user";
}

export async function saveForumCategory(formData: FormData) {
  const user = await requireAdminUser();

  const id = String(formData.get("id") ?? "").trim();
  const input = {
    ...(id ? { id } : {}),
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    order: Number(formData.get("order") ?? 0),
    min_role_view: parseRole(formData.get("min_role_view")),
    min_role_post: parseRole(formData.get("min_role_post")),
  };

  const service = createServiceRoleClient();
  const saved = await upsertForumCategory(service, input);
  await logAdminAction(service, {
    adminId: user.id,
    action: id ? "update" : "create",
    entity: "forum_categories",
    entityId: saved.id,
    diff: input,
  });

  revalidatePath("/forum");
  redirect("/forum");
}

export async function deleteForumCategoryAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteForumCategory(service, id);
  await logAdminAction(service, {
    adminId: user.id,
    action: "delete",
    entity: "forum_categories",
    entityId: id,
  });

  revalidatePath("/forum");
}

export async function toggleThreadPinnedAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextPinned = formData.get("pinned") === "true";

  const service = createServiceRoleClient();
  await setThreadPinned(service, id, nextPinned);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "forum_threads",
    entityId: id,
    diff: { pinned: nextPinned },
  });

  revalidatePath("/forum/moderazione");
  revalidatePath(`/forum/moderazione/${id}`);
}

export async function toggleThreadLockedAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const nextLocked = formData.get("locked") === "true";

  const service = createServiceRoleClient();
  await setThreadLocked(service, id, nextLocked);
  await logAdminAction(service, {
    adminId: user.id,
    action: "update",
    entity: "forum_threads",
    entityId: id,
    diff: { locked: nextLocked },
  });

  revalidatePath("/forum/moderazione");
  revalidatePath(`/forum/moderazione/${id}`);
}

export async function deleteThreadAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");

  const service = createServiceRoleClient();
  await deleteThread(service, id);
  await logAdminAction(service, { adminId: user.id, action: "delete", entity: "forum_threads", entityId: id });

  revalidatePath("/forum/moderazione");
}

export async function deletePostAction(formData: FormData) {
  const user = await requireAdminUser();
  const id = String(formData.get("id") ?? "");
  const threadId = String(formData.get("thread_id") ?? "");

  const service = createServiceRoleClient();
  await deletePost(service, id);
  await logAdminAction(service, { adminId: user.id, action: "delete", entity: "forum_posts", entityId: id });

  revalidatePath("/forum/moderazione");
  if (threadId) {
    revalidatePath(`/forum/moderazione/${threadId}`);
  }
}
