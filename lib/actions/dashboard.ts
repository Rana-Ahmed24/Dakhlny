"use server";

import { getAccessRequests } from "@/lib/actions/access-requests";
import { getAuditLogs } from "@/lib/actions/audit";
import { getProviderApplications } from "@/lib/actions/provider-applications";
import { getProviders } from "@/lib/actions/providers";
import { getTransactionLogs } from "@/lib/actions/transactions";
import { computePlatformAnalytics } from "@/lib/operations/analytics";
import type { ActionResult, AdminDashboardData } from "@/lib/types";

export async function getAdminDashboardData(): Promise<
  ActionResult<AdminDashboardData>
> {
  const [requestsResult, appsResult, providersResult, txResult, auditResult] =
    await Promise.all([
      getAccessRequests(),
      getProviderApplications(),
      getProviders(),
      getTransactionLogs(),
      getAuditLogs(),
    ]);

  if (!requestsResult.success) {
    return { success: false, error: requestsResult.error };
  }
  if (!appsResult.success) {
    return { success: false, error: appsResult.error };
  }
  if (!providersResult.success) {
    return { success: false, error: providersResult.error };
  }

  const accessRequests = requestsResult.data ?? [];
  const providers = providersResult.data ?? [];
  const analytics = computePlatformAnalytics(accessRequests, providers);

  return {
    success: true,
    data: {
      accessRequests,
      providerApplications: appsResult.data ?? [],
      providers,
      transactionLogs: txResult.success ? (txResult.data ?? []) : [],
      auditLogs: auditResult.success ? (auditResult.data ?? []) : [],
      analytics,
    },
  };
}
