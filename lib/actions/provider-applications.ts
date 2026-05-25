"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { logAuditEvent } from "@/lib/actions/audit";
import { normalizeAccessTypes } from "@/lib/operations/access-request-ops";
import type {
  ActionResult,
  CreateProviderApplicationInput,
  ProviderApplication,
  UpdateProviderApplicationInput,
} from "@/lib/types";

function mapApplication(row: Record<string, unknown>): ProviderApplication {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    phone: (row.phone as string) ?? (row.whatsapp as string) ?? "",
    villages: (row.villages as string[]) ?? [],
    access_types: normalizeAccessTypes((row.access_types as string[]) ?? []),
    average_pricing: row.average_pricing as string | null,
    provider_notes:
      (row.provider_notes as string | null) ??
      (row.availability_notes as string | null),
    available_from: row.available_from as string | null,
    available_to: row.available_to as string | null,
    status: row.status as ProviderApplication["status"],
    admin_notes: row.admin_notes as string | null,
    created_at: row.created_at as string,
  };
}

function validateProviderApplication(
  input: CreateProviderApplicationInput
): string | null {
  if (!input.full_name.trim()) return "Full name is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (input.villages.length === 0) return "Select at least one village.";
  if (input.access_types.length === 0) return "Select at least one access type.";
  if (!input.available_from) return "Availability start date is required.";
  if (!input.available_to) return "Availability end date is required.";
  if (input.available_from > input.available_to) {
    return "Availability end date must be after start date.";
  }
  return null;
}

export async function createProviderApplication(
  input: CreateProviderApplicationInput
): Promise<ActionResult> {
  const validationError = validateProviderApplication(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("provider_applications").insert({
      full_name: input.full_name.trim(),
      phone: input.phone.trim(),
      villages: input.villages,
      access_types: normalizeAccessTypes(input.access_types),
      average_pricing: input.average_pricing?.trim() || null,
      provider_notes: input.provider_notes?.trim() || null,
      available_from: input.available_from,
      available_to: input.available_to,
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
          : "Unable to submit application. Please try again.",
    };
  }
}

export async function getProviderApplications(): Promise<
  ActionResult<ProviderApplication[]>
> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("provider_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: (data ?? []).map((r) =>
        mapApplication(r as Record<string, unknown>)
      ),
    };
  } catch {
    return {
      success: false,
      error: "Unable to load provider applications.",
    };
  }
}

export async function updateProviderApplication(
  input: UpdateProviderApplicationInput
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {};
    if (input.status !== undefined) updates.status = input.status;
    if (input.admin_notes !== undefined) {
      updates.admin_notes = input.admin_notes;
    }

    const { error } = await supabase
      .from("provider_applications")
      .update(updates)
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to update application.",
    };
  }
}

export async function approveProviderApplication(
  applicationId: string
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();

    const { data: app, error: fetchError } = await supabase
      .from("provider_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (fetchError || !app) {
      return { success: false, error: "Application not found." };
    }

    const mapped = mapApplication(app as Record<string, unknown>);

    const { error: insertError } = await supabase.from("providers").insert({
      full_name: mapped.full_name,
      phone: mapped.phone,
      villages: mapped.villages,
      access_types: mapped.access_types,
      average_pricing: mapped.average_pricing,
      provider_notes: mapped.provider_notes,
      available_from: mapped.available_from,
      available_to: mapped.available_to,
      status: "active",
    });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    const { error: updateError } = await supabase
      .from("provider_applications")
      .update({ status: "approved" })
      .eq("id", applicationId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    await logAuditEvent({
      entityType: "provider_application",
      entityId: applicationId,
      action: "approve_provider_application",
      newValue: mapped.full_name,
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to approve provider.",
    };
  }
}
