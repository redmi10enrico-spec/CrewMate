export { createSupabaseClient } from "./client";
export type { SupabaseEnv } from "./client";
export type { AppRole, Database } from "./database.types";

export {
  createMcVerificationCode,
  generateVerificationCode,
  getProfile,
  hasRoleAtLeast,
  updateMcUsername,
} from "./profiles";
export type { CreatedVerificationCode, ProfileRow } from "./profiles";
