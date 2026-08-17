import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { Database } from "@crewmate/db";
import { verifyMcCode } from "@crewmate/db";

export async function POST(request: Request) {
  const secret = request.headers.get("x-mc-verify-secret");
  if (!secret || secret !== process.env.MC_VERIFY_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code.trim().toUpperCase() : null;
  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }
  const mcUuid = typeof body?.mcUuid === "string" ? body.mcUuid : undefined;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "server misconfigured" }, { status: 500 });
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);
  const result = await verifyMcCode(supabase, code, mcUuid);

  switch (result.status) {
    case "ok":
      return NextResponse.json({ success: true });
    case "invalid":
      return NextResponse.json({ error: "invalid code" }, { status: 404 });
    case "already_used":
      return NextResponse.json({ error: "code already used" }, { status: 409 });
    case "expired":
      return NextResponse.json({ error: "code expired" }, { status: 410 });
  }
}
