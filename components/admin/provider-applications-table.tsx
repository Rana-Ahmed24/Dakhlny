"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import {
  updateProviderApplication,
  approveProviderApplication,
} from "@/lib/actions/provider-applications";
import { PROVIDER_APPLICATION_STATUS_LABELS } from "@/lib/constants";
import type { ProviderApplication } from "@/lib/types";
import { formatDateTime, formatWhatsAppLink, joinList } from "@/lib/utils";

interface ProviderApplicationsTableProps {
  applications: ProviderApplication[];
  onRefresh: () => void;
}

export function ProviderApplicationsTable({
  applications,
  onRefresh,
}: ProviderApplicationsTableProps) {
  const [editing, setEditing] = useState<ProviderApplication | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

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
      toast.success("Provider approved and added to database");
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
      toast.success("Application rejected");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleSaveNotes() {
    if (!editing) return;
    setSaving(true);
    const result = await updateProviderApplication({
      id: editing.id,
      admin_notes: notes || null,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Notes saved");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        title="No provider applications"
        description="New applications will appear here when users apply."
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {applications.map((app) => (
          <div
            key={app.id}
            className="rounded-[1.25rem] border border-white/80 bg-white p-4 shadow-[0_8px_30px_rgba(7,16,24,0.05)]"
          >
            <div className="flex items-start justify-between">
              <p className="font-semibold">{app.full_name}</p>
              <Badge variant={app.status}>{app.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {joinList(app.villages)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => openEdit(app)}
            >
              Review
            </Button>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Villages</th>
              <th className="px-4 py-3 font-medium">Access types</th>
              <th className="px-4 py-3 font-medium">Pricing</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {applications.map((app) => (
              <tr key={app.id} className="bg-card hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{app.full_name}</td>
                <td className="px-4 py-3">
                  <div>{app.phone}</div>
                  <a
                    href={formatWhatsAppLink(app.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp
                  </a>
                </td>
                <td className="px-4 py-3">{joinList(app.villages)}</td>
                <td className="px-4 py-3">{joinList(app.access_types)}</td>
                <td className="px-4 py-3">{app.average_pricing ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={app.status}>
                    {PROVIDER_APPLICATION_STATUS_LABELS[app.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateTime(app.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(app)}
                  >
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
            <DialogTitle>Review Application — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <p>
                  <strong>Villages:</strong> {joinList(editing.villages)}
                </p>
                <p>
                  <strong>Access types:</strong>{" "}
                  {joinList(editing.access_types)}
                </p>
                <p>
                  <strong>Pricing:</strong>{" "}
                  {editing.average_pricing ?? "Not specified"}
                </p>
                {editing.availability_notes ? (
                  <p>
                    <strong>Availability:</strong> {editing.availability_notes}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {editing.status === "pending" ? (
                  <>
                    <Button
                      variant="navy"
                      className="flex-1"
                      onClick={handleApprove}
                      disabled={saving}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleReject}
                      disabled={saving}
                    >
                      Reject
                    </Button>
                  </>
                ) : null}
                <Button
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={saving}
                >
                  Save Notes
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
