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

export type VerifyMcCodeResult =
  | { status: "ok"; userId: string }
  | { status: "invalid" }
  | { status: "already_used" }
  | { status: "expired" };

/**
 * Consuma un codice di verifica generato da createMcVerificationCode.
 * Va chiamata solo con un client service-role (bypassa la RLS): il
 * chiamante previsto è l'endpoint server-to-server /api/mc-verify, mai
 * il client di un utente autenticato.
 */
export async function verifyMcCode(
  client: SupabaseClient<Database>,
  code: string,
  mcUuid?: string
): Promise<VerifyMcCodeResult> {
  const { data: codeRow, error: lookupError } = await client
    .from("mc_verification_codes")
    .select("id, user_id, expires_at, used")
    .eq("code", code)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`verifyMcCode: ${lookupError.message}`);
  }
  if (!codeRow) {
    return { status: "invalid" };
  }
  if (codeRow.used) {
    return { status: "already_used" };
  }
  if (new Date(codeRow.expires_at).getTime() < Date.now()) {
    return { status: "expired" };
  }

  const { error: markUsedError } = await client
    .from("mc_verification_codes")
    .update({ used: true })
    .eq("id", codeRow.id);
  if (markUsedError) {
    throw new Error(`verifyMcCode: ${markUsedError.message}`);
  }

  const { error: profileError } = await client
    .from("profiles")
    .update({ mc_verified: true, ...(mcUuid ? { mc_uuid: mcUuid } : {}) })
    .eq("id", codeRow.user_id);
  if (profileError) {
    throw new Error(`verifyMcCode: ${profileError.message}`);
  }

  return { status: "ok", userId: codeRow.user_id };
}
