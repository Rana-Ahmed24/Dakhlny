import type { AccessRequestWithProvider, PlatformAnalytics, Provider } from "@/lib/types";

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isWithinDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return d >= cutoff;
}

function sumProfit(requests: AccessRequestWithProvider[]): number {
  return requests.reduce((sum, r) => sum + (r.platform_profit ?? 0), 0);
}

export function computePlatformAnalytics(
  requests: AccessRequestWithProvider[],
  providers: Provider[]
): PlatformAnalytics {
  const completed = requests.filter((r) => r.status === "completed");
  const failed = requests.filter((r) => r.status === "failed");
  const cancelled = requests.filter((r) => r.status === "cancelled");
  const withProfit = requests.filter((r) => r.platform_profit != null);

  const todayStart = startOfDay(new Date()).toISOString();
  const todayRevenue = sumProfit(
    withProfit.filter((r) => r.created_at >= todayStart)
  );
  const weeklyRevenue = sumProfit(withProfit.filter((r) => isWithinDays(r.created_at, 7)));
  const monthlyRevenue = sumProfit(
    withProfit.filter((r) => isWithinDays(r.created_at, 30))
  );
  const totalRevenue = sumProfit(withProfit);

  const pendingPayments = requests.filter(
    (r) => r.payment_status === "pending" || r.payment_status === "partial"
  ).length;

  const villageMap = new Map<string, { count: number; revenue: number }>();
  for (const r of requests) {
    const cur = villageMap.get(r.village) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    cur.revenue += r.platform_profit ?? 0;
    villageMap.set(r.village, cur);
  }

  const topVillages = [...villageMap.entries()]
    .map(([village, data]) => ({ village, ...data }))
    .sort((a, b) => b.revenue - a.revenue || b.count - a.count)
    .slice(0, 5);

  const providerMap = new Map<
    string,
    { name: string; revenue: number; count: number }
  >();
  for (const r of completed) {
    if (!r.assigned_provider_id || !r.provider) continue;
    const cur = providerMap.get(r.assigned_provider_id) ?? {
      name: r.provider.full_name,
      revenue: 0,
      count: 0,
    };
    cur.revenue += r.provider_payout ?? 0;
    cur.count += 1;
    providerMap.set(r.assigned_provider_id, cur);
  }

  const topProviders = [...providerMap.entries()]
    .map(([providerId, data]) => ({ providerId, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  void providers;

  return {
    todayRevenue,
    weeklyRevenue,
    monthlyRevenue,
    totalRevenue,
    pendingPayments,
    completedRequests: completed.length,
    failedRequests: failed.length,
    cancelledRequests: cancelled.length,
    topVillages,
    topProviders,
  };
}

export function computeProviderStats(
  provider: Provider,
  requests: AccessRequestWithProvider[]
) {
  const assigned = requests.filter((r) => r.assigned_provider_id === provider.id);
  const completed = assigned.filter((r) => r.status === "completed");
  const totalEarnings = completed.reduce((s, r) => s + (r.provider_payout ?? 0), 0);
  const averagePayout =
    completed.length > 0 ? totalEarnings / completed.length : 0;
  const lastCompleted = completed
    .map((r) => r.created_at)
    .sort()
    .reverse()[0] ?? null;
  const recentCustomers = completed
    .slice(0, 5)
    .map((r) => r.full_name);

  return {
    total_earnings: totalEarnings,
    total_completed: completed.length,
    average_payout: averagePayout,
    last_completed_at: lastCompleted,
    recent_customers: recentCustomers,
  };
}

export function computeReliabilityScore(
  successful: number,
  failed: number,
  cancelled: number
): number {
  const total = successful + failed + cancelled;
  if (total === 0) return 100;
  const score = (successful / total) * 100 - cancelled * 2 - failed * 5;
  return Math.max(0, Math.min(100, Number(score.toFixed(1))));
}
