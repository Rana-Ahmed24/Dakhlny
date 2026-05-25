import type { PlatformAnalytics } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-[-0.02em] text-navy sm:text-2xl">
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function AnalyticsPanel({ analytics }: { analytics: PlatformAnalytics }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatCard label="Today" value={formatCurrency(analytics.todayRevenue)} />
        <StatCard label="Weekly" value={formatCurrency(analytics.weeklyRevenue)} />
        <StatCard
          label="Monthly"
          value={formatCurrency(analytics.monthlyRevenue)}
        />
        <StatCard label="Total" value={formatCurrency(analytics.totalRevenue)} />
        <StatCard
          label="Pending Pay"
          value={String(analytics.pendingPayments)}
        />
        <StatCard
          label="Completed"
          value={String(analytics.completedRequests)}
        />
        <StatCard label="Failed" value={String(analytics.failedRequests)} />
        <StatCard
          label="Cancelled"
          value={String(analytics.cancelledRequests)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Villages
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {analytics.topVillages.length === 0 ? (
              <li className="text-muted-foreground">No data yet</li>
            ) : (
              analytics.topVillages.map((v) => (
                <li key={v.village} className="flex justify-between gap-2">
                  <span className="font-medium">{v.village}</span>
                  <span className="text-muted-foreground">
                    {v.count} · {formatCurrency(v.revenue)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Providers
          </p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {analytics.topProviders.length === 0 ? (
              <li className="text-muted-foreground">No data yet</li>
            ) : (
              analytics.topProviders.map((p) => (
                <li key={p.providerId} className="flex justify-between gap-2">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground">
                    {p.count} · {formatCurrency(p.revenue)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
