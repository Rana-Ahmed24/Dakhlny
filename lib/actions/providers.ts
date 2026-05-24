"use server";

import { createAdminClient } from "@/lib/supabase/client";
import type {
  ActionResult,
  Provider,
  UpdateProviderInput,
} from "@/lib/types";

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

    return { success: true, data: data ?? [] };
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

    const updates: Record<string, unknown> = {};
    if (input.full_name !== undefined) updates.full_name = input.full_name;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (input.whatsapp !== undefined) updates.whatsapp = input.whatsapp;
    if (input.villages !== undefined) updates.villages = input.villages;
    if (input.access_types !== undefined)
      updates.access_types = input.access_types;
    if (input.average_pricing !== undefined)
      updates.average_pricing = input.average_pricing;
    if (input.rating !== undefined) updates.rating = input.rating;
    if (input.notes !== undefined) updates.notes = input.notes;
    if (input.status !== undefined) updates.status = input.status;

    const { error } = await supabase
      .from("providers")
      .update(updates)
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to update provider.",
    };
  }
}
