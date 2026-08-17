"use server";

import { redirect } from "next/navigation";
import { createMcVerificationCode } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestMcVerificationCode() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { code } = await createMcVerificationCode(supabase, user.id);
  redirect(`/account?code=${encodeURIComponent(code)}`);
}
