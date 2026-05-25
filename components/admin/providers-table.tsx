"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
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
import { updateProvider } from "@/lib/actions/providers";
import { PROVIDER_STATUS_LABELS, SUPPORTED_VILLAGES } from "@/lib/constants";
import { computeProviderStats } from "@/lib/operations/analytics";
import type { AccessRequestWithProvider, Provider } from "@/lib/types";
import type { ProviderStatus } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  joinList,
  truncateText,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ProvidersTableProps {
  providers: Provider[];
  requests: AccessRequestWithProvider[];
  onRefresh: () => void;
}

export function ProvidersTable({
  providers,
  requests,
  onRefresh,
}: ProvidersTableProps) {
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ProviderStatus>("all");
  const [blacklistFilter, setBlacklistFilter] = useState<"all" | "yes" | "no">(
    "all"
  );
  const [sort, setSort] = useState<"newest" | "reliability" | "earnings">(
    "reliability"
  );
  const [editing, setEditing] = useState<Provider | null>(null);
  const [status, setStatus] = useState<ProviderStatus>("active");
  const [rating, setRating] = useState("");
  const [providerNotes, setProviderNotes] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    let list = [...providers];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.full_name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          joinList(p.villages).toLowerCase().includes(q)
      );
    }
    if (village !== "all") {
      list = list.filter((p) => p.villages.includes(village));
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (blacklistFilter === "yes") list = list.filter((p) => p.is_blacklisted);
    if (blacklistFilter === "no") list = list.filter((p) => !p.is_blacklisted);

    if (sort === "reliability") {
      list.sort((a, b) => b.reliability_score - a.reliability_score);
    } else if (sort === "earnings") {
      list.sort((a, b) => {
        const ea = computeProviderStats(a, requests).total_earnings;
        const eb = computeProviderStats(b, requests).total_earnings;
        return eb - ea;
      });
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return list;
  }, [providers, requests, search, village, statusFilter, blacklistFilter, sort]);

  function openEdit(provider: Provider) {
    setEditing(provider);
    setStatus(provider.status);
    setRating(provider.rating?.toString() ?? "");
    setProviderNotes(provider.provider_notes ?? "");
    setAdminNotes(provider.admin_notes ?? "");
    setAvailableFrom(provider.available_from ?? "");
    setAvailableTo(provider.available_to ?? "");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const result = await updateProvider({
      id: editing.id,
      status,
      rating: rating ? Number(rating) : null,
      provider_notes: providerNotes || null,
      admin_notes: adminNotes || null,
      available_from: availableFrom || null,
      available_to: availableTo || null,
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

  async function toggleBlacklist(p: Provider) {
    const result = await updateProvider({
      id: p.id,
      is_blacklisted: !p.is_blacklisted,
      blacklist_reason: !p.is_blacklisted ? "Blacklisted by admin" : null,
    });
    if (result.success) {
      toast.success(p.is_blacklisted ? "Unblacklisted" : "Blacklisted");
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  async function saveInlineNotes(id: string, notes: string | null) {
    const result = await updateProvider({ id, admin_notes: notes });
    if (result.success) onRefresh();
    return result.success;
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
      <div className="mb-4 grid gap-2 rounded-xl border border-border bg-white p-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Search providers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={village} onValueChange={setVillage}>
          <SelectTrigger>
            <SelectValue placeholder="Village" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All villages</SelectItem>
            {SUPPORTED_VILLAGES.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={blacklistFilter}
          onValueChange={(v) => setBlacklistFilter(v as typeof blacklistFilter)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Blacklist: all</SelectItem>
            <SelectItem value="yes">Blacklisted</SelectItem>
            <SelectItem value="no">Clear</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reliability">Reliability</SelectItem>
            <SelectItem value="earnings">Earnings</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 lg:hidden">
        {filtered.map((p) => {
          const stats = computeProviderStats(p, requests);
          return (
            <div
              key={p.id}
              className={cn(
                "rounded-xl border bg-white p-4",
                p.is_blacklisted && "border-red-200 bg-red-50/30"
              )}
            >
              <div className="flex justify-between">
                <p className="font-semibold">{p.full_name}</p>
                <Badge variant={p.status}>{p.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Reliability {p.reliability_score}% · Earned{" "}
                {formatCurrency(stats.total_earnings)}
              </p>
              <div className="mt-2">
                <WhatsAppButton phone={p.phone} />
              </div>
              <Button variant="outline" size="sm" className="mt-2 w-full" onClick={() => openEdit(p)}>
                Edit
              </Button>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Provider</th>
              <th className="px-3 py-2 font-medium">Reliability</th>
              <th className="px-3 py-2 font-medium">Performance</th>
              <th className="px-3 py-2 font-medium">Availability</th>
              <th className="px-3 py-2 font-medium">Villages</th>
              <th className="px-3 py-2 font-medium min-w-[160px]">Admin notes</th>
              <th className="px-3 py-2 font-medium">Contact</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => {
              const stats = computeProviderStats(p, requests);
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "bg-card",
                    p.is_blacklisted && "bg-red-50/40"
                  )}
                >
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.full_name}</div>
                    {p.is_blacklisted ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700">
                        <AlertTriangle className="h-3 w-3" /> Blacklisted
                      </span>
                    ) : null}
                    {p.provider_notes ? (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        P: {truncateText(p.provider_notes, 36)}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-semibold">{p.reliability_score}%</div>
                    <div className="text-xs text-muted-foreground">
                      ✓{p.successful_requests} ✗{p.failed_requests} ⊘
                      {p.cancelled_requests}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <div>{stats.total_completed} completed</div>
                    <div>{formatCurrency(stats.total_earnings)} earned</div>
                    <div>Avg {formatCurrency(stats.average_payout)}</div>
                    {stats.recent_customers.length > 0 ? (
                      <div className="text-muted-foreground mt-1">
                        Recent: {stats.recent_customers.join(", ")}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-xs whitespace-nowrap">
                    {p.available_from
                      ? `${formatDate(p.available_from)} – ${p.available_to ? formatDate(p.available_to) : "∞"}`
                      : "Not set"}
                  </td>
                  <td className="px-3 py-2 text-xs">{joinList(p.villages)}</td>
                  <td className="px-3 py-2">
                    <AdminNotesCell
                      value={p.admin_notes}
                      onSave={(n) => saveInlineNotes(p.id, n)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <WhatsAppButton phone={p.phone} label="WA" />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => toggleBlacklist(p)}
                      >
                        {p.is_blacklisted ? "Unblock" : "Block"}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                {(() => {
                  const s = computeProviderStats(editing, requests);
                  return (
                    <>
                      <p>
                        Completed: {s.total_completed} · Earnings:{" "}
                        {formatCurrency(s.total_earnings)}
                      </p>
                      <p>Reliability: {editing.reliability_score}%</p>
                    </>
                  );
                })()}
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as ProviderStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{PROVIDER_STATUS_LABELS.active}</SelectItem>
                  <SelectItem value="inactive">{PROVIDER_STATUS_LABELS.inactive}</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Available from</label>
                  <Input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Available to</label>
                  <Input
                    type="date"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                  />
                </div>
              </div>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating 0-5"
              />
              <Textarea
                value={providerNotes}
                onChange={(e) => setProviderNotes(e.target.value)}
                placeholder="Provider notes"
                rows={2}
              />
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Admin notes"
                rows={2}
              />
              <WhatsAppButton phone={editing.phone} />
              <Button variant="navy" className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
