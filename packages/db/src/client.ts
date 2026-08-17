import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function createSupabaseClient(env: SupabaseEnv): SupabaseClient<Database> {
  if (!env.url || !env.anonKey) {
    throw new Error("createSupabaseClient: url e anonKey sono obbligatori");
  }
  return createClient<Database>(env.url, env.anonKey);
}
