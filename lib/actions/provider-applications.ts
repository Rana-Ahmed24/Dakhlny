"use server";

import { createAdminClient } from "@/lib/supabase/client";
import type {
  ActionResult,
  CreateProviderApplicationInput,
  ProviderApplication,
  UpdateProviderApplicationInput,
} from "@/lib/types";

function validateProviderApplication(
  input: CreateProviderApplicationInput
): string | null {
  if (!input.full_name.trim()) return "Full name is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (!input.whatsapp.trim()) return "WhatsApp number is required.";
  if (input.villages.length === 0) return "Select at least one village.";
  if (input.access_types.length === 0) return "Select at least one access type.";
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
      whatsapp: input.whatsapp.trim(),
      villages: input.villages,
      access_types: input.access_types,
      average_pricing: input.average_pricing?.trim() || null,
      availability_notes: input.availability_notes?.trim() || null,
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

    return { success: true, data: data ?? [] };
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

    const { error: insertError } = await supabase.from("providers").insert({
      full_name: app.full_name,
      phone: app.phone,
      whatsapp: app.whatsapp,
      villages: app.villages,
      access_types: app.access_types,
      average_pricing: app.average_pricing,
      notes: app.availability_notes,
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

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to approve provider.",
    };
  }
}
