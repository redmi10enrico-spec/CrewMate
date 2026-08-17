"use server";

import { redirect } from "next/navigation";
import { createThread, getForumCategories } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createThreadAction(categorySlug: string, formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const categories = await getForumCategories(supabase);
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) {
    redirect("/forum");
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    redirect(`/forum/${categorySlug}/nuovo?error=1`);
  }

  const thread = await createThread(supabase, {
    categoryId: category.id,
    authorId: user.id,
    title,
    content,
  });

  redirect(`/forum/${categorySlug}/${thread.slug}`);
}
