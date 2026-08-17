import { createSupabaseClient, getApplicationForms } from "@crewmate/db";
import type { ApplicationFormRow } from "@crewmate/db";

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// A differenza di Home/Shop, le candidature non hanno un contenuto di
// default sensato da mostrare: sono interamente definite dall'admin
// (brief §6.4). Se Supabase non è configurato o non ci sono ancora
// moduli, la pagina mostra semplicemente "nessun modulo disponibile".
export async function getOpenApplicationForms(): Promise<ApplicationFormRow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const client = createSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });
    return await getApplicationForms(client);
  } catch {
    return [];
  }
}
