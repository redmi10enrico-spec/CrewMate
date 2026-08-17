"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { replyToThread } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function replyAction(
  threadId: string,
  categorySlug: string,
  threadSlug: string,
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    redirect(`/forum/${categorySlug}/${threadSlug}`);
  }

  await replyToThread(supabase, { threadId, authorId: user.id, content });

  revalidatePath(`/forum/${categorySlug}/${threadSlug}`);
  redirect(`/forum/${categorySlug}/${threadSlug}`);
}
