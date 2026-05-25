"use client";

import { EmptyState } from "@/components/shared/empty-state";
import type { AuditLog } from "@/lib/types";
import { formatDateTime, truncateText } from "@/lib/utils";

export function AuditLogsTable({ logs }: { logs: AuditLog[] }) {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No audit logs"
        description="Admin actions will be recorded here automatically."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Time</th>
            <th className="px-3 py-2 font-medium">Entity</th>
            <th className="px-3 py-2 font-medium">Action</th>
            <th className="px-3 py-2 font-medium">Field</th>
            <th className="px-3 py-2 font-medium">Previous</th>
            <th className="px-3 py-2 font-medium">New</th>
            <th className="px-3 py-2 font-medium">Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {logs.map((log) => (
            <tr key={log.id} className="bg-card">
              <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                {formatDateTime(log.created_at)}
              </td>
              <td className="px-3 py-2 text-xs">
                {log.entity_type}
                <br />
                <span className="text-muted-foreground font-mono">
                  {truncateText(log.entity_id, 12)}
                </span>
              </td>
              <td className="px-3 py-2 font-medium">{log.action}</td>
              <td className="px-3 py-2">{log.field_name ?? "—"}</td>
              <td className="px-3 py-2 max-w-[140px] truncate text-muted-foreground">
                {truncateText(log.previous_value, 40)}
              </td>
              <td className="px-3 py-2 max-w-[140px] truncate">
                {truncateText(log.new_value, 40)}
              </td>
              <td className="px-3 py-2">{log.admin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
