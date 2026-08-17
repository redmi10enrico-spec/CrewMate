import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ServerModeRow = Database["public"]["Tables"]["server_modes"]["Row"];
export type ServerModeInput = Database["public"]["Tables"]["server_modes"]["Insert"];
export type HomeFeatureRow = Database["public"]["Tables"]["home_features"]["Row"];
export type HomeFeatureInput = Database["public"]["Tables"]["home_features"]["Insert"];

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

// --- Scritture per il pannello admin: vanno chiamate con un client
// service-role (bypassano la RLS), mai con il client di un utente. ---

export async function upsertSiteSettings(
  client: SupabaseClient<Database>,
  entries: Record<string, string>
): Promise<void> {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value }));
  const { error } = await client.from("site_settings").upsert(rows, { onConflict: "key" });

  if (error) {
    throw new Error(`upsertSiteSettings: ${error.message}`);
  }
}

export async function listServerModes(client: SupabaseClient<Database>): Promise<ServerModeRow[]> {
  const { data, error } = await client.from("server_modes").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`listServerModes: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertServerMode(
  client: SupabaseClient<Database>,
  input: ServerModeInput
): Promise<ServerModeRow> {
  const { data, error } = await client.from("server_modes").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertServerMode: ${error.message}`);
  }

  return data;
}

export async function deleteServerMode(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("server_modes").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteServerMode: ${error.message}`);
  }
}

export async function listHomeFeatures(client: SupabaseClient<Database>): Promise<HomeFeatureRow[]> {
  const { data, error } = await client.from("home_features").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`listHomeFeatures: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertHomeFeature(
  client: SupabaseClient<Database>,
  input: HomeFeatureInput
): Promise<HomeFeatureRow> {
  const { data, error } = await client.from("home_features").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertHomeFeature: ${error.message}`);
  }

  return data;
}

export async function deleteHomeFeature(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("home_features").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteHomeFeature: ${error.message}`);
  }
}
