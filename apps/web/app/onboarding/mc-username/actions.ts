"use server";

import { redirect } from "next/navigation";
import { updateMcUsername } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveMcUsername(formData: FormData) {
  const mcUsername = String(formData.get("mcUsername") ?? "").trim();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!mcUsername) {
    redirect(
      `/onboarding/mc-username?error=${encodeURIComponent("Inserisci il tuo nome Minecraft.")}`
    );
  }

  await updateMcUsername(supabase, user.id, mcUsername);
  redirect("/");
}
