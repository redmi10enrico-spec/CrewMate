import { createServerClient } from "@supabase/ssr";
import { getProfile } from "@crewmate/db";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);

  // Nessun progetto Supabase reale ancora collegato (vedi docs/SETUP.md):
  // il guard resta disattivo finché le env non sono configurate.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isPublicPath) {
      return response;
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const profile = await getProfile(supabase, user.id);
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=not-admin", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login?error=error", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
