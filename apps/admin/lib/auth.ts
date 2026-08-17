import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Il middleware già blocca l'accesso a chi non ha role = admin (anche per
 * le richieste POST delle server action). Questa funzione recupera solo
 * l'utente autenticato per usarlo come admin_id negli audit log.
 */
export async function requireAdminUser(): Promise<User> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
