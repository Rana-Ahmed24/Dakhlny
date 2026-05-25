"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { logFieldChanges, logAuditEvent } from "@/lib/actions/audit";
import { ADMIN_ACTOR } from "@/lib/constants";
import type { ActionResult, Provider, UpdateProviderInput } from "@/lib/types";

function mapProvider(row: Record<string, unknown>): Provider {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    phone: (row.phone as string) ?? (row.whatsapp as string) ?? "",
    villages: (row.villages as string[]) ?? [],
    access_types: (row.access_types as string[]) ?? [],
    average_pricing: row.average_pricing as string | null,
    rating: row.rating != null ? Number(row.rating) : null,
    provider_notes:
      (row.provider_notes as string | null) ?? (row.notes as string | null),
    admin_notes: row.admin_notes as string | null,
    available_from: row.available_from as string | null,
    available_to: row.available_to as string | null,
    status: row.status as Provider["status"],
    is_blacklisted: Boolean(row.is_blacklisted),
    blacklist_reason: row.blacklist_reason as string | null,
    blacklisted_at: row.blacklisted_at as string | null,
    blacklisted_by: row.blacklisted_by as string | null,
    successful_requests: Number(row.successful_requests ?? 0),
    failed_requests: Number(row.failed_requests ?? 0),
    cancelled_requests: Number(row.cancelled_requests ?? 0),
    reliability_score: Number(row.reliability_score ?? 100),
    created_at: row.created_at as string,
  };
}

export async function getProviders(): Promise<ActionResult<Provider[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: (data ?? []).map((r) => mapProvider(r as Record<string, unknown>)),
    };
  } catch {
    return {
      success: false,
      error: "Unable to load providers.",
    };
  }
}

export async function updateProvider(
  input: UpdateProviderInput
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    const { data: existing, error: fetchError } = await supabase
      .from("providers")
      .select("*")
      .eq("id", input.id)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: "Provider not found." };
    }

    const previous = mapProvider(existing as Record<string, unknown>);
    const updates: Record<string, unknown> = {};

    if (input.full_name !== undefined) updates.full_name = input.full_name;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (input.villages !== undefined) updates.villages = input.villages;
    if (input.access_types !== undefined)
      updates.access_types = input.access_types;
    if (input.average_pricing !== undefined)
      updates.average_pricing = input.average_pricing;
    if (input.rating !== undefined) updates.rating = input.rating;
    if (input.provider_notes !== undefined)
      updates.provider_notes = input.provider_notes;
    if (input.admin_notes !== undefined) updates.admin_notes = input.admin_notes;
    if (input.available_from !== undefined)
      updates.available_from = input.available_from;
    if (input.available_to !== undefined) updates.available_to = input.available_to;
    if (input.status !== undefined) updates.status = input.status;

    if (input.is_blacklisted !== undefined) {
      updates.is_blacklisted = input.is_blacklisted;
      if (input.is_blacklisted) {
        updates.blacklisted_at = new Date().toISOString();
        updates.blacklisted_by = ADMIN_ACTOR;
        updates.blacklist_reason =
          input.blacklist_reason ?? previous.blacklist_reason ?? "Blacklisted";
      } else {
        updates.blacklisted_at = null;
        updates.blacklisted_by = null;
        updates.blacklist_reason = null;
      }
    } else if (input.blacklist_reason !== undefined) {
      updates.blacklist_reason = input.blacklist_reason;
    }

    const { error } = await supabase
      .from("providers")
      .update(updates)
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    await logFieldChanges({
      entityType: "provider",
      entityId: input.id,
      action: "update_provider",
      previous: previous as unknown as Record<string, unknown>,
      updates,
    });

    if (input.is_blacklisted !== undefined) {
      await logAuditEvent({
        entityType: "provider",
        entityId: input.id,
        action: input.is_blacklisted ? "blacklist_provider" : "unblacklist_provider",
        newValue: input.is_blacklisted
          ? String(updates.blacklist_reason)
          : "cleared",
      });
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to update provider.",
    };
  }
}
