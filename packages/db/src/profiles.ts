import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppRole, Database } from "./database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const ROLE_RANK: Record<AppRole, number> = {
  user: 0,
  helper: 1,
  mod: 2,
  admin: 3,
};

export function hasRoleAtLeast(role: AppRole, minRole: AppRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

export async function getProfile(
  client: SupabaseClient<Database>,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (error) {
    throw new Error(`getProfile: ${error.message}`);
  }
  return data;
}

export async function updateMcUsername(
  client: SupabaseClient<Database>,
  userId: string,
  mcUsername: string
): Promise<void> {
  const { error } = await client.from("profiles").update({ mc_username: mcUsername }).eq("id", userId);

  if (error) {
    throw new Error(`updateMcUsername: ${error.message}`);
  }
}

const VERIFICATION_CODE_LENGTH = 6;
// Alfabeto senza caratteri ambigui (niente O/0, I/1) da leggere/digitare in gioco.
const VERIFICATION_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const VERIFICATION_CODE_TTL_MINUTES = 15;

export function generateVerificationCode(): string {
  let code = "";
  for (let i = 0; i < VERIFICATION_CODE_LENGTH; i++) {
    code += VERIFICATION_CODE_ALPHABET[Math.floor(Math.random() * VERIFICATION_CODE_ALPHABET.length)];
  }
  return code;
}

export interface CreatedVerificationCode {
  code: string;
  expiresAt: string;
}

export async function createMcVerificationCode(
  client: SupabaseClient<Database>,
  userId: string
): Promise<CreatedVerificationCode> {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60_000).toISOString();

  const { error } = await client.from("mc_verification_codes").insert({
    user_id: userId,
    code,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(`createMcVerificationCode: ${error.message}`);
  }

  return { code, expiresAt };
}
