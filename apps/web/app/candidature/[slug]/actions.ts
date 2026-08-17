"use server";

import { redirect } from "next/navigation";
import { submitApplication } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitApplicationAction(
  formId: string,
  questionIds: string[],
  formData: FormData
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const answers = questionIds.map((questionId) => ({
    questionId,
    value: String(formData.get(questionId) ?? ""),
  }));

  await submitApplication(supabase, formId, user.id, answers);

  redirect("/account/candidature?success=1");
}
