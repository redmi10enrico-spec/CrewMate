import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export interface AdminActionInput {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  diff?: unknown;
}

/**
 * Registra una modifica fatta dal pannello admin. Va chiamata con un
 * client service-role (bypassa la RLS), sempre subito dopo la scrittura
 * che documenta.
 */
export async function logAdminAction(
  client: SupabaseClient<Database>,
  input: AdminActionInput
): Promise<void> {
  const { error } = await client.from("audit_logs").insert({
    admin_id: input.adminId,
    action: input.action,
    entity: input.entity,
    entity_id: input.entityId ?? null,
    diff: input.diff ?? null,
  });

  if (error) {
    throw new Error(`logAdminAction: ${error.message}`);
  }
}
