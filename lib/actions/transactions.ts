"use server";

import { createAdminClient } from "@/lib/supabase/client";
import { ADMIN_ACTOR } from "@/lib/constants";
import type { PaymentMethod } from "@/lib/constants";
import type { ActionResult, AccessRequest, TransactionLog } from "@/lib/types";

export async function createTransactionLog(params: {
  requestId: string | null;
  providerId: string | null;
  customerName: string;
  village: string;
  customerPaid: number;
  providerPaid: number;
  platformProfit: number;
  paymentMethod?: PaymentMethod | null;
  paymentStatus: AccessRequest["payment_status"];
  admin?: string;
}): Promise<ActionResult> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("transaction_logs").insert({
      request_id: params.requestId,
      provider_id: params.providerId,
      customer_name: params.customerName,
      village: params.village,
      customer_paid: params.customerPaid,
      provider_paid: params.providerPaid,
      platform_profit: params.platformProfit,
      payment_method: params.paymentMethod ?? null,
      payment_status: params.paymentStatus,
      admin: params.admin ?? ADMIN_ACTOR,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch {
    return { success: false, error: "Unable to log transaction." };
  }
}

export async function getTransactionLogs(): Promise<
  ActionResult<TransactionLog[]>
> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("transaction_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return { success: false, error: error.message };
    return { success: true, data: (data ?? []) as TransactionLog[] };
  } catch {
    return { success: false, error: "Unable to load transaction logs." };
  }
}
