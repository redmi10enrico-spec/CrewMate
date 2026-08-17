import { createClient } from "@supabase/supabase-js";
import type { Database } from "@crewmate/db";

/**
 * Client con service role: bypassa la RLS. Da usare solo in server
 * actions/route handler dopo aver verificato che il chiamante è un admin
 * autenticato (il middleware già lo garantisce per le pagine del
 * pannello, ma le server action lo ricontrollano comunque).
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase non configurato: vedi docs/SETUP.md");
  }

  return createClient<Database>(url, key);
}
