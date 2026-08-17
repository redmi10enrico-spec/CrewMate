export { createSupabaseClient } from "./client";
export type { SupabaseEnv } from "./client";
export type { AppRole, Database } from "./database.types";

export {
  createMcVerificationCode,
  generateVerificationCode,
  getProfile,
  hasRoleAtLeast,
  updateMcUsername,
  verifyMcCode,
} from "./profiles";
export type { CreatedVerificationCode, ProfileRow, VerifyMcCodeResult } from "./profiles";

export {
  deleteHomeFeature,
  deleteServerMode,
  getEnabledHomeFeatures,
  getEnabledServerModes,
  getSiteSettings,
  listHomeFeatures,
  listServerModes,
  upsertHomeFeature,
  upsertServerMode,
  upsertSiteSettings,
} from "./site-content";
export type { HomeFeatureInput, HomeFeatureRow, ServerModeInput, ServerModeRow } from "./site-content";

export { logAdminAction } from "./audit-log";
export type { AdminActionInput } from "./audit-log";
