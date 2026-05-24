"use client";

import { useState } from "react";
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
import { updateProvider } from "@/lib/actions/providers";
import { PROVIDER_STATUS_LABELS } from "@/lib/constants";
import type { Provider } from "@/lib/types";
import type { ProviderStatus } from "@/lib/constants";
import { formatDateTime, formatWhatsAppLink, joinList } from "@/lib/utils";

interface ProvidersTableProps {
  providers: Provider[];
  onRefresh: () => void;
}

export function ProvidersTable({ providers, onRefresh }: ProvidersTableProps) {
  const [editing, setEditing] = useState<Provider | null>(null);
  const [status, setStatus] = useState<ProviderStatus>("active");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  function openEdit(provider: Provider) {
    setEditing(provider);
    setStatus(provider.status);
    setRating(provider.rating?.toString() ?? "");
    setNotes(provider.notes ?? "");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const result = await updateProvider({
      id: editing.id,
      status,
      rating: rating ? Number(rating) : null,
      notes: notes || null,
    });
    setSaving(false);

    if (result.success) {
      toast.success("Provider updated");
      setEditing(null);
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  if (providers.length === 0) {
    return (
      <EmptyState
        title="No approved providers"
        description="Approve provider applications to add them here."
      />
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {providers.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <p className="font-semibold">{p.full_name}</p>
              <Badge variant={p.status}>{p.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {joinList(p.villages)}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => openEdit(p)}
            >
              Edit
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
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {providers.map((p) => (
              <tr key={p.id} className="bg-card hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{p.full_name}</td>
                <td className="px-4 py-3">
                  <div>{p.phone}</div>
                  <a
                    href={formatWhatsAppLink(p.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    WhatsApp
                  </a>
                </td>
                <td className="px-4 py-3">{joinList(p.villages)}</td>
                <td className="px-4 py-3">{joinList(p.access_types)}</td>
                <td className="px-4 py-3">{p.rating ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status}>
                    {PROVIDER_STATUS_LABELS[p.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateTime(p.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(p)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Provider — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ProviderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rating (0-5)</label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
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
