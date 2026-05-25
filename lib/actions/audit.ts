"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { ADMIN_ACTOR } from "@/lib/constants";
import type { ActionResult, AuditLog } from "@/lib/types";

export async function logAuditEvent(params: {
  entityType: string;
  entityId: string;
  action: string;
  fieldName?: string;
  previousValue?: string | null;
  newValue?: string | null;
  admin?: string;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_logs").insert({
      entity_type: params.entityType,
      entity_id: params.entityId,
      action: params.action,
      field_name: params.fieldName ?? null,
      previous_value:
        params.previousValue != null ? String(params.previousValue) : null,
      new_value: params.newValue != null ? String(params.newValue) : null,
      admin: params.admin ?? ADMIN_ACTOR,
    });
  } catch {
    // Audit failures must not block operations
  }
}

export async function logFieldChanges<T extends Record<string, unknown>>(params: {
  entityType: string;
  entityId: string;
  action: string;
  previous: T;
  updates: Partial<T>;
  admin?: string;
}): Promise<void> {
  for (const [key, value] of Object.entries(params.updates)) {
    if (value === undefined) continue;
    const prev = params.previous[key];
    const prevStr = prev == null ? null : String(prev);
    const newStr = value == null ? null : String(value);
    if (prevStr === newStr) continue;
    await logAuditEvent({
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      fieldName: key,
      previousValue: prevStr,
      newValue: newStr,
      admin: params.admin,
    });
  }
}

export async function getAuditLogs(): Promise<ActionResult<AuditLog[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data ?? []) as AuditLog[] };
  } catch {
    return { success: false, error: "Unable to load audit logs." };
  }
}
