"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { AdminNotesCell } from "@/components/admin/shared/admin-notes-cell";
import { WhatsAppButton } from "@/components/admin/shared/whatsapp-button";
import {
  updateProviderApplication,
  approveProviderApplication,
} from "@/lib/actions/provider-applications";
import { PROVIDER_APPLICATION_STATUS_LABELS } from "@/lib/constants";
import type { ProviderApplication } from "@/lib/types";
import { formatDate, formatDateTime, joinList, truncateText } from "@/lib/utils";

interface ProviderApplicationsTableProps {
  applications: ProviderApplication[];
  onRefresh: () => void;
}

export function ProviderApplicationsTable({
  applications,
  onRefresh,
}: ProviderApplicationsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ProviderApplication["status"]
  >("all");
  const [editing, setEditing] = useState<ProviderApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    let list = [...applications];
    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.full_name.toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          joinList(a.villages).toLowerCase().includes(q)
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [applications, search, statusFilter]);

  function openEdit(app: ProviderApplication) {
    setEditing(app);
    setNotes(app.admin_notes ?? "");
  }

  async function handleApprove() {
    if (!editing) return;
    setSaving(true);
    const result = await approveProviderApplication(editing.id);
    setSaving(false);
    if (result.success) {
      toast.success("Provider approved");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleReject() {
    if (!editing) return;
    setSaving(true);
    const result = await updateProviderApplication({
      id: editing.id,
      status: "rejected",
      admin_notes: notes || null,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Rejected");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  async function saveInlineNotes(id: string, n: string | null) {
    const result = await updateProviderApplication({ id, admin_notes: n });
    if (result.success) onRefresh();
    return result.success;
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No provider applications"
        description="New applications will appear here."
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-white p-3">
        <Input
          className="max-w-xs flex-1 min-w-[140px]"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Contact</th>
              <th className="px-3 py-2 font-medium">Villages</th>
              <th className="px-3 py-2 font-medium">Access</th>
              <th className="px-3 py-2 font-medium">Availability</th>
              <th className="px-3 py-2 font-medium">Provider notes</th>
              <th className="px-3 py-2 font-medium min-w-[160px]">Admin notes</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Created</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((app) => (
              <tr key={app.id} className="bg-card hover:bg-muted/20">
                <td className="px-3 py-2 font-medium">{app.full_name}</td>
                <td className="px-3 py-2">
                  <div className="text-xs">{app.phone}</div>
                  <WhatsAppButton phone={app.phone} label="WA" />
                </td>
                <td className="px-3 py-2 text-xs">{joinList(app.villages)}</td>
                <td className="px-3 py-2 text-xs">{joinList(app.access_types)}</td>
                <td className="px-3 py-2 text-xs whitespace-nowrap">
                  {app.available_from
                    ? `${formatDate(app.available_from)} – ${app.available_to ? formatDate(app.available_to) : "—"}`
                    : "—"}
                </td>
                <td className="px-3 py-2 text-xs max-w-[140px]">
                  {truncateText(app.provider_notes, 50)}
                </td>
                <td className="px-3 py-2">
                  <AdminNotesCell
                    value={app.admin_notes}
                    onSave={(n) => saveInlineNotes(app.id, n)}
                  />
                </td>
                <td className="px-3 py-2">
                  <Badge variant={app.status}>
                    {PROVIDER_APPLICATION_STATUS_LABELS[app.status]}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {formatDateTime(app.created_at)}
                </td>
                <td className="px-3 py-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(app)}>
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <p>
                  <strong>Villages:</strong> {joinList(editing.villages)}
                </p>
                <p>
                  <strong>Access:</strong> {joinList(editing.access_types)}
                </p>
                <p>
                  <strong>Availability:</strong>{" "}
                  {editing.available_from
                    ? `${formatDate(editing.available_from)} – ${editing.available_to ? formatDate(editing.available_to) : "—"}`
                    : "Not specified"}
                </p>
                {editing.provider_notes ? (
                  <p>
                    <strong>Provider notes:</strong> {editing.provider_notes}
                  </p>
                ) : null}
                <WhatsAppButton phone={editing.phone} />
              </div>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              <div className="flex flex-col gap-2 sm:flex-row">
                {editing.status === "pending" ? (
                  <>
                    <Button variant="navy" className="flex-1" onClick={handleApprove} disabled={saving}>
                      Approve
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={saving}>
                      Reject
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
