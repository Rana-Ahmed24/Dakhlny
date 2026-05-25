"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { AccessRequestsTable } from "@/components/admin/access-requests-table";
import { ProviderApplicationsTable } from "@/components/admin/provider-applications-table";
import { ProvidersTable } from "@/components/admin/providers-table";
import { AnalyticsPanel } from "@/components/admin/analytics-panel";
import { AuditLogsTable } from "@/components/admin/audit-logs-table";
import { TransactionLogsTable } from "@/components/admin/transaction-logs-table";
import { logoutAdmin } from "@/lib/actions/admin-auth";
import { getAdminDashboardData } from "@/lib/actions/dashboard";
import type { AdminDashboardData } from "@/lib/types";

export function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminDashboardData | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getAdminDashboardData();
    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setData(result.data ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
    router.refresh();
  }

  const pendingRequests =
    data?.accessRequests.filter((r) => r.status === "pending").length ?? 0;
  const pendingApps =
    data?.providerApplications.filter((a) => a.status === "pending").length ?? 0;
  const urgentRequests =
    data?.accessRequests.filter(
      (r) =>
        r.urgency === "urgent" ||
        r.urgency === "standing_at_gate" ||
        r.urgency === "high"
    ).length ?? 0;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-white/60 glass-light">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.02em] text-navy sm:text-2xl">
              Operations
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Dakhlny Admin · Audit & Revenue
            </p>
          </div>
          <div className="flex items-center gap-2">
            {urgentRequests > 0 ? (
              <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                {urgentRequests} urgent
              </span>
            ) : null}
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {loading ? (
          <LoadingSpinner label="Loading dashboard..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : data ? (
          <div className="space-y-6">
            <AnalyticsPanel analytics={data.analytics} />

            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="mb-4 flex h-auto min-h-10 w-full flex-wrap gap-1">
                <TabsTrigger value="requests" className="flex-1 min-w-[100px]">
                  Requests
                  {pendingRequests > 0 ? (
                    <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs text-white">
                      {pendingRequests}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex-1 min-w-[100px]">
                  Applications
                  {pendingApps > 0 ? (
                    <span className="ml-1 rounded-full bg-amber-500 px-1.5 text-xs text-white">
                      {pendingApps}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="providers" className="flex-1 min-w-[100px]">
                  Providers
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 min-w-[100px]">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex-1 min-w-[100px]">
                  Audit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requests">
                <AccessRequestsTable
                  requests={data.accessRequests}
                  providers={data.providers}
                  onRefresh={loadData}
                />
              </TabsContent>

              <TabsContent value="applications">
                <ProviderApplicationsTable
                  applications={data.providerApplications}
                  onRefresh={loadData}
                />
              </TabsContent>

              <TabsContent value="providers">
                <ProvidersTable
                  providers={data.providers}
                  requests={data.accessRequests}
                  onRefresh={loadData}
                />
              </TabsContent>

              <TabsContent value="transactions">
                <TransactionLogsTable logs={data.transactionLogs} />
              </TabsContent>

              <TabsContent value="audit">
                <AuditLogsTable logs={data.auditLogs} />
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </main>
    </div>
  );
}
