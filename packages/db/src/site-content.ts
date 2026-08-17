import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ServerModeRow = Database["public"]["Tables"]["server_modes"]["Row"];
export type HomeFeatureRow = Database["public"]["Tables"]["home_features"]["Row"];

export async function getSiteSettings(
  client: SupabaseClient<Database>
): Promise<Record<string, unknown>> {
  const { data, error } = await client.from("site_settings").select("key, value");

  if (error) {
    throw new Error(`getSiteSettings: ${error.message}`);
  }

  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
}

export async function getEnabledServerModes(
  client: SupabaseClient<Database>
): Promise<ServerModeRow[]> {
  const { data, error } = await client
    .from("server_modes")
    .select("*")
    .eq("enabled", true)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getEnabledServerModes: ${error.message}`);
  }

  return data ?? [];
}

export async function getEnabledHomeFeatures(
  client: SupabaseClient<Database>
): Promise<HomeFeatureRow[]> {
  const { data, error } = await client
    .from("home_features")
    .select("*")
    .eq("enabled", true)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getEnabledHomeFeatures: ${error.message}`);
  }

  return data ?? [];
}
