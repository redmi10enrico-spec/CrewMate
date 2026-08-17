import { NextResponse } from "next/server";
import { getProfile } from "@crewmate/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Accesso con Discord non riuscito.")}`
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error?.message ?? "Accesso con Discord non riuscito.")}`
    );
  }

  try {
    const profile = await getProfile(supabase, data.user.id);
    if (!profile?.mc_username) {
      return NextResponse.redirect(`${origin}/onboarding/mc-username`);
    }
  } catch {
    return NextResponse.redirect(`${origin}/onboarding/mc-username`);
  }

  return NextResponse.redirect(origin);
}
