"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PAYMENT_STATUS_LABELS } from "@/lib/constants";
import type { TransactionLog } from "@/lib/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function TransactionLogsTable({ logs }: { logs: TransactionLog[] }) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No transactions logged"
        description="Transactions are logged when requests are completed with revenue data."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[1000px] text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Customer</th>
            <th className="px-3 py-2 font-medium">Village</th>
            <th className="px-3 py-2 font-medium">Customer paid</th>
            <th className="px-3 py-2 font-medium">Provider paid</th>
            <th className="px-3 py-2 font-medium">Platform profit</th>
            <th className="px-3 py-2 font-medium">Payment</th>
            <th className="px-3 py-2 font-medium">Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {logs.map((log) => (
            <tr key={log.id} className="bg-card">
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                {formatDateTime(log.created_at)}
              </td>
              <td className="px-3 py-2 font-medium">{log.customer_name}</td>
              <td className="px-3 py-2">{log.village}</td>
              <td className="px-3 py-2">{formatCurrency(log.customer_paid)}</td>
              <td className="px-3 py-2">{formatCurrency(log.provider_paid)}</td>
              <td className="px-3 py-2 font-semibold text-emerald-700">
                {formatCurrency(log.platform_profit)}
              </td>
              <td className="px-3 py-2">
                <Badge variant={log.payment_status}>
                  {PAYMENT_STATUS_LABELS[log.payment_status]}
                </Badge>
              </td>
              <td className="px-3 py-2 text-xs">{log.admin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
