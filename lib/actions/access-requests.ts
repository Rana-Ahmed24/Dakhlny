"use server";

import { createAdminClient } from "@/lib/supabase/client";
import type {
  ActionResult,
  CreateAccessRequestInput,
  UpdateAccessRequestInput,
  AccessRequestWithProvider,
} from "@/lib/types";

function validateAccessRequest(
  input: CreateAccessRequestInput
): string | null {
  if (!input.full_name.trim()) return "Full name is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (!input.whatsapp.trim()) return "WhatsApp number is required.";
  if (!input.village.trim()) return "Village is required.";
  if (!input.access_date) return "Access date is required.";
  if (input.people_count < 1) return "Number of people must be at least 1.";
  return null;
}

export async function createAccessRequest(
  input: CreateAccessRequestInput
): Promise<ActionResult> {
  const validationError = validateAccessRequest(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("access_requests").insert({
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      whatsapp: input.whatsapp.trim(),
      village: input.village.trim(),
      access_date: input.access_date,
      people_count: input.people_count,
      car_access: input.car_access,
      notes: input.notes?.trim() || null,
      status: "pending",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to submit request. Please try again.",
    };
  }
}

export async function getAccessRequests(): Promise<
  ActionResult<AccessRequestWithProvider[]>
> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("access_requests")
      .select("*, providers(*)")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    const requests: AccessRequestWithProvider[] = (data ?? []).map((row) => ({
      id: row.id,
      full_name: row.full_name,
      phone: row.phone,
      whatsapp: row.whatsapp,
      village: row.village,
      access_date: row.access_date,
      people_count: row.people_count,
      car_access: row.car_access,
      notes: row.notes,
      status: row.status,
      assigned_provider_id: row.assigned_provider_id,
      admin_notes: row.admin_notes,
      created_at: row.created_at,
      provider: Array.isArray(row.providers)
        ? row.providers[0]
        : row.providers ?? null,
    }));

    return { success: true, data: requests };
  } catch {
    return {
      success: false,
      error: "Unable to load access requests.",
    };
  }
}

export async function updateAccessRequest(
  input: UpdateAccessRequestInput
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (input.status !== undefined) updates.status = input.status;
    if (input.assigned_provider_id !== undefined) {
      updates.assigned_provider_id = input.assigned_provider_id;
    }
    if (input.admin_notes !== undefined) {
      updates.admin_notes = input.admin_notes;
    }

    const { error } = await supabase
      .from("access_requests")
      .update(updates)
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to update access request.",
    };
  }
}
