"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { logFieldChanges, logAuditEvent } from "@/lib/actions/audit";
import { createTransactionLog } from "@/lib/actions/transactions";
import { ADMIN_ACTOR } from "@/lib/constants";
import { calcPlatformProfit } from "@/lib/operations/access-request-ops";
import { isDateBeforeToday } from "@/lib/utils";
import { computeReliabilityScore } from "@/lib/operations/analytics";
import type {
  ActionResult,
  AccessRequest,
  CreateAccessRequestInput,
  UpdateAccessRequestInput,
  AccessRequestWithProvider,
} from "@/lib/types";

function mapAccessRequestRow(row: Record<string, unknown>): AccessRequest {
  return {
    id: row.id as string,
    full_name: row.full_name as string,
    phone: (row.phone as string) ?? (row.whatsapp as string) ?? "",
    village: row.village as string,
    access_date: row.access_date as string,
    access_type:
      (row.access_type as AccessRequest["access_type"]) ??
      (row.car_access ? "Car access" : "Guest access"),
    people_count: row.people_count as number,
    customer_notes:
      (row.customer_notes as string | null) ?? (row.notes as string | null),
    status: row.status as AccessRequest["status"],
    assigned_provider_id: row.assigned_provider_id as string | null,
    admin_notes: row.admin_notes as string | null,
    customer_price: row.customer_price != null ? Number(row.customer_price) : null,
    provider_payout:
      row.provider_payout != null ? Number(row.provider_payout) : null,
    platform_profit:
      row.platform_profit != null ? Number(row.platform_profit) : null,
    payment_status:
      (row.payment_status as AccessRequest["payment_status"]) ?? "pending",
    is_vip: Boolean(row.is_vip),
    vip_notes: row.vip_notes as string | null,
    urgency: (row.urgency as AccessRequest["urgency"]) ?? "medium",
    is_blacklisted: Boolean(row.is_blacklisted),
    blacklist_reason: row.blacklist_reason as string | null,
    blacklisted_at: row.blacklisted_at as string | null,
    blacklisted_by: row.blacklisted_by as string | null,
    created_at: row.created_at as string,
  };
}

function mapProviderRow(row: Record<string, unknown>) {
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
    status: row.status as "active" | "inactive",
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

function validateAccessRequest(
  input: CreateAccessRequestInput
): string | null {
  if (!input.full_name.trim()) return "Full name is required.";
  if (!input.phone.trim()) return "Phone number is required.";
  if (!input.village.trim()) return "Village is required.";
  if (!input.access_date) return "Access date is required.";
  if (isDateBeforeToday(input.access_date)) {
    return "Access date cannot be before today.";
  }
  if (input.people_count < 1) return "Number of people must be at least 1.";
  if (!input.access_type) return "Access type is required.";
  return null;
}

async function syncProviderReliability(
  providerId: string,
  previousStatus: string,
  newStatus: string
): Promise<void> {
  if (previousStatus === newStatus) return;
  const supabase = createAdminClient();
  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("id", providerId)
    .single();
  if (!provider) return;

  let successful = Number(provider.successful_requests ?? 0);
  let failed = Number(provider.failed_requests ?? 0);
  let cancelled = Number(provider.cancelled_requests ?? 0);

  const decrement = (status: string) => {
    if (status === "completed") successful = Math.max(0, successful - 1);
    if (status === "failed") failed = Math.max(0, failed - 1);
    if (status === "cancelled") cancelled = Math.max(0, cancelled - 1);
  };
  const increment = (status: string) => {
    if (status === "completed") successful += 1;
    if (status === "failed") failed += 1;
    if (status === "cancelled") cancelled += 1;
  };

  if (["completed", "failed", "cancelled"].includes(previousStatus)) {
    decrement(previousStatus);
  }
  if (["completed", "failed", "cancelled"].includes(newStatus)) {
    increment(newStatus);
  }

  const reliability_score = computeReliabilityScore(
    successful,
    failed,
    cancelled
  );

  await supabase
    .from("providers")
    .update({ successful_requests: successful, failed_requests: failed, cancelled_requests: cancelled, reliability_score })
    .eq("id", providerId);
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
      village: input.village.trim(),
      access_date: input.access_date,
      access_type: input.access_type,
      people_count: input.people_count,
      customer_notes: input.customer_notes?.trim() || null,
      status: "pending",
      payment_status: "pending",
      urgency: "medium",
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

    const requests: AccessRequestWithProvider[] = (data ?? []).map((row) => {
      const base = mapAccessRequestRow(row as Record<string, unknown>);
      const providerRaw = Array.isArray(row.providers)
        ? row.providers[0]
        : row.providers;
      return {
        ...base,
        provider: providerRaw
          ? mapProviderRow(providerRaw as Record<string, unknown>)
          : null,
      };
    });

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

    const { data: existing, error: fetchError } = await supabase
      .from("access_requests")
      .select("*")
      .eq("id", input.id)
      .single();

    if (fetchError || !existing) {
      return { success: false, error: "Request not found." };
    }

    const previous = mapAccessRequestRow(existing as Record<string, unknown>);
    const updates: Record<string, unknown> = {};

    if (input.status !== undefined) updates.status = input.status;
    if (input.assigned_provider_id !== undefined) {
      updates.assigned_provider_id = input.assigned_provider_id;
    }
    if (input.admin_notes !== undefined) updates.admin_notes = input.admin_notes;
    if (input.customer_notes !== undefined) {
      updates.customer_notes = input.customer_notes;
    }
    if (input.access_type !== undefined) updates.access_type = input.access_type;
    if (input.customer_price !== undefined) {
      updates.customer_price = input.customer_price;
    }
    if (input.provider_payout !== undefined) {
      updates.provider_payout = input.provider_payout;
    }
    if (input.payment_status !== undefined) {
      updates.payment_status = input.payment_status;
    }
    if (input.is_vip !== undefined) updates.is_vip = input.is_vip;
    if (input.vip_notes !== undefined) updates.vip_notes = input.vip_notes;
    if (input.urgency !== undefined) updates.urgency = input.urgency;

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

    const nextCustomerPrice =
      input.customer_price !== undefined
        ? input.customer_price
        : previous.customer_price;
    const nextProviderPayout =
      input.provider_payout !== undefined
        ? input.provider_payout
        : previous.provider_payout;
    const profit = calcPlatformProfit(nextCustomerPrice, nextProviderPayout);
    if (profit !== null) updates.platform_profit = profit;

    const { error } = await supabase
      .from("access_requests")
      .update(updates)
      .eq("id", input.id);

    if (error) {
      return { success: false, error: error.message };
    }

    await logFieldChanges({
      entityType: "access_request",
      entityId: input.id,
      action: "update_access_request",
      previous: previous as unknown as Record<string, unknown>,
      updates: updates as Record<string, unknown>,
    });

    const newStatus = (input.status ?? previous.status) as string;
    const oldStatus = previous.status;
    const providerId =
      input.assigned_provider_id !== undefined
        ? input.assigned_provider_id
        : previous.assigned_provider_id;

    if (providerId && newStatus !== oldStatus) {
      await syncProviderReliability(providerId, oldStatus, newStatus);
    }

    if (
      newStatus === "completed" &&
      nextCustomerPrice != null &&
      nextProviderPayout != null &&
      profit != null &&
      (oldStatus !== "completed" ||
        input.customer_price !== undefined ||
        input.provider_payout !== undefined)
    ) {
      await createTransactionLog({
        requestId: input.id,
        providerId: providerId,
        customerName: previous.full_name,
        village: previous.village,
        customerPaid: nextCustomerPrice,
        providerPaid: nextProviderPayout,
        platformProfit: profit,
        paymentStatus:
          input.payment_status ?? previous.payment_status ?? "pending",
      });
    }

    if (input.assigned_provider_id !== undefined && input.assigned_provider_id) {
      await logAuditEvent({
        entityType: "access_request",
        entityId: input.id,
        action: "assign_provider",
        fieldName: "assigned_provider_id",
        previousValue: previous.assigned_provider_id,
        newValue: input.assigned_provider_id,
      });
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Unable to update access request.",
    };
  }
}

export async function blacklistCustomerByPhone(
  phone: string,
  reason: string
): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("access_requests")
      .update({
        is_blacklisted: true,
        blacklist_reason: reason,
        blacklisted_at: new Date().toISOString(),
        blacklisted_by: ADMIN_ACTOR,
      })
      .eq("phone", phone.trim());

    if (error) return { success: false, error: error.message };

    await logAuditEvent({
      entityType: "customer",
      entityId: phone,
      action: "blacklist_customer",
      newValue: reason,
    });

    return { success: true };
  } catch {
    return { success: false, error: "Unable to blacklist customer." };
  }
}
