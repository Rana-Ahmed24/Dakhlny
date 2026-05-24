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
import { logoutAdmin } from "@/lib/actions/admin-auth";
import { getAccessRequests } from "@/lib/actions/access-requests";
import { getProviderApplications } from "@/lib/actions/provider-applications";
import { getProviders } from "@/lib/actions/providers";
import type {
  AccessRequestWithProvider,
  ProviderApplication,
  Provider,
} from "@/lib/types";

export function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessRequests, setAccessRequests] = useState<
    AccessRequestWithProvider[]
  >([]);
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [requestsResult, appsResult, providersResult] = await Promise.all([
      getAccessRequests(),
      getProviderApplications(),
      getProviders(),
    ]);

    if (
      !requestsResult.success ||
      !appsResult.success ||
      !providersResult.success
    ) {
      const errMsg =
        (!requestsResult.success && requestsResult.error) ||
        (!appsResult.success && appsResult.error) ||
        (!providersResult.success && providersResult.error) ||
        "Failed to load dashboard data";
      setError(errMsg);
      setLoading(false);
      return;
    }

    setAccessRequests(requestsResult.data ?? []);
    setApplications(appsResult.data ?? []);
    setProviders(providersResult.data ?? []);
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

  const pendingRequests = accessRequests.filter(
    (r) => r.status === "pending"
  ).length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-navy">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Dakhlny Operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {loading ? (
          <LoadingSpinner label="Loading dashboard..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="requests">
                Requests
                {pendingRequests > 0 ? (
                  <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">
                    {pendingRequests}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="applications">
                Applications
                {pendingApps > 0 ? (
                  <span className="ml-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs text-white">
                    {pendingApps}
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <AccessRequestsTable
                requests={accessRequests}
                providers={providers}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="applications">
              <ProviderApplicationsTable
                applications={applications}
                onRefresh={loadData}
              />
            </TabsContent>

            <TabsContent value="providers">
              <ProvidersTable providers={providers} onRefresh={loadData} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
