"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { updateAccessRequest } from "@/lib/actions/access-requests";
import {
  ACCESS_REQUEST_STATUSES,
  ACCESS_REQUEST_STATUS_LABELS,
} from "@/lib/constants";
import type { AccessRequestWithProvider, Provider } from "@/lib/types";
import {
  formatDate,
  formatDateTime,
  formatWhatsAppLink,
  joinList,
} from "@/lib/utils";
import type { AccessRequestStatus } from "@/lib/constants";

interface AccessRequestsTableProps {
  requests: AccessRequestWithProvider[];
  providers: Provider[];
  onRefresh: () => void;
}

export function AccessRequestsTable({
  requests,
  providers,
  onRefresh,
}: AccessRequestsTableProps) {
  const [editing, setEditing] = useState<AccessRequestWithProvider | null>(null);
  const [status, setStatus] = useState<AccessRequestStatus>("pending");
  const [providerId, setProviderId] = useState<string>("none");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function openEdit(request: AccessRequestWithProvider) {
    setEditing(request);
    setStatus(request.status);
    setProviderId(request.assigned_provider_id ?? "none");
    setNotes(request.admin_notes ?? "");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const result = await updateAccessRequest({
      id: editing.id,
      status,
      assigned_provider_id: providerId === "none" ? null : providerId,
      admin_notes: notes || null,
    });
    setSaving(false);

    if (result.success) {
      toast.success("Request updated");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No access requests"
        description="New requests will appear here when customers submit the form."
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{req.full_name}</p>
                <p className="text-sm text-muted-foreground">{req.village}</p>
              </div>
              <Badge variant={req.status}>{req.status}</Badge>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Date</span>
                <p>{formatDate(req.access_date)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">People</span>
                <p>{req.people_count}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Car</span>
                <p>{req.car_access ? "Yes" : "No"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone</span>
                <p>{req.phone}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => openEdit(req)}
            >
              Manage
            </Button>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Village</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">People</th>
              <th className="px-4 py-3 font-medium">Car</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {requests.map((req) => (
              <tr key={req.id} className="bg-card hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{req.full_name}</td>
                <td className="px-4 py-3">
                  <div>{req.phone}</div>
                  <a
                    href={formatWhatsAppLink(req.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp
                  </a>
                </td>
                <td className="px-4 py-3">{req.village}</td>
                <td className="px-4 py-3">{formatDate(req.access_date)}</td>
                <td className="px-4 py-3">{req.people_count}</td>
                <td className="px-4 py-3">{req.car_access ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <Badge variant={req.status}>{req.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  {req.provider?.full_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateTime(req.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(req)}
                  >
                    Manage
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
            <DialogTitle>Manage Request — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p>
                  <strong>Village:</strong> {editing.village} ·{" "}
                  <strong>Date:</strong> {formatDate(editing.access_date)} ·{" "}
                  <strong>People:</strong> {editing.people_count}
                </p>
                {editing.notes ? (
                  <p className="mt-1 text-muted-foreground">
                    Customer notes: {editing.notes}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as AccessRequestStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCESS_REQUEST_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ACCESS_REQUEST_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign provider</label>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {providers
                      .filter((p) => p.status === "active")
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name} — {joinList(p.villages)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Internal notes..."
                />
              </div>

              <Button
                variant="navy"
                className="w-full"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
