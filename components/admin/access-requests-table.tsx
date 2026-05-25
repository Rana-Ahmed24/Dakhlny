"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Crown, Star } from "lucide-react";
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
import { CountdownBadge } from "@/components/admin/shared/countdown-badge";
import { WhatsAppButton } from "@/components/admin/shared/whatsapp-button";
import { updateAccessRequest } from "@/lib/actions/access-requests";
import {
  ACCESS_REQUEST_STATUSES,
  ACCESS_REQUEST_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
  REQUEST_URGENCIES,
  REQUEST_SORT_OPTIONS,
  SUPPORTED_VILLAGES,
  URGENCY_LABELS,
} from "@/lib/constants";
import {
  filterAccessRequests,
  getCompatibleProviders,
  isUrgentRequest,
  sortAccessRequests,
  type AccessRequestFilters,
} from "@/lib/operations/access-request-ops";
import type { AccessRequestWithProvider, Provider } from "@/lib/types";
import type {
  AccessRequestStatus,
  PaymentStatus,
  RequestSortOption,
  RequestUrgency,
} from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  truncateText,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AccessRequestsTableProps {
  requests: AccessRequestWithProvider[];
  providers: Provider[];
  onRefresh: () => void;
}

const defaultFilters: AccessRequestFilters = {
  search: "",
  village: "all",
  status: "all",
  providerId: "all",
  dateFrom: "",
  dateTo: "",
  blacklisted: "all",
  vip: "all",
  paymentStatus: "all",
  urgency: "all",
  accessType: "all",
};

export function AccessRequestsTable({
  requests,
  providers,
  onRefresh,
}: AccessRequestsTableProps) {
  const [filters, setFilters] = useState<AccessRequestFilters>(defaultFilters);
  const [sort, setSort] = useState<RequestSortOption>("urgency");
  const [editing, setEditing] = useState<AccessRequestWithProvider | null>(null);
  const [status, setStatus] = useState<AccessRequestStatus>("pending");
  const [providerId, setProviderId] = useState<string>("none");
  const [adminNotes, setAdminNotes] = useState("");
  const [customerPrice, setCustomerPrice] = useState("");
  const [providerPayout, setProviderPayout] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [urgency, setUrgency] = useState<RequestUrgency>("medium");
  const [isVip, setIsVip] = useState(false);
  const [vipNotes, setVipNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const f = filterAccessRequests(requests, filters);
    return sortAccessRequests(f, sort);
  }, [requests, filters, sort]);

  const compatibleProviders = useMemo(() => {
    if (!editing) return [];
    return getCompatibleProviders(providers, editing);
  }, [editing, providers]);

  function openEdit(request: AccessRequestWithProvider) {
    setEditing(request);
    setStatus(request.status);
    setProviderId(request.assigned_provider_id ?? "none");
    setAdminNotes(request.admin_notes ?? "");
    setCustomerPrice(request.customer_price?.toString() ?? "");
    setProviderPayout(request.provider_payout?.toString() ?? "");
    setPaymentStatus(request.payment_status);
    setUrgency(request.urgency);
    setIsVip(request.is_vip);
    setVipNotes(request.vip_notes ?? "");
  }

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    const result = await updateAccessRequest({
      id: editing.id,
      status,
      assigned_provider_id: providerId === "none" ? null : providerId,
      admin_notes: adminNotes || null,
      customer_price: customerPrice ? Number(customerPrice) : null,
      provider_payout: providerPayout ? Number(providerPayout) : null,
      payment_status: paymentStatus,
      urgency,
      is_vip: isVip,
      vip_notes: vipNotes || null,
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

  async function toggleBlacklist(req: AccessRequestWithProvider) {
    const result = await updateAccessRequest({
      id: req.id,
      is_blacklisted: !req.is_blacklisted,
      blacklist_reason: !req.is_blacklisted ? "Blacklisted by admin" : null,
    });
    if (result.success) {
      toast.success(req.is_blacklisted ? "Unblacklisted" : "Blacklisted");
      onRefresh();
    } else {
      toast.error(result.error);
    }
  }

  async function saveInlineNotes(id: string, notes: string | null) {
    const result = await updateAccessRequest({ id, admin_notes: notes });
    if (result.success) onRefresh();
    return result.success;
  }

  function RequestRowBadges({ req }: { req: AccessRequestWithProvider }) {
    return (
      <div className="flex flex-wrap gap-1">
        {req.is_vip ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
            <Crown className="h-3 w-3" /> VIP
          </span>
        ) : null}
        {req.is_blacklisted ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
            <AlertTriangle className="h-3 w-3" /> BL
          </span>
        ) : null}
        {isUrgentRequest(req.urgency) ? (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-900">
            {URGENCY_LABELS[req.urgency]}
          </span>
        ) : null}
      </div>
    );
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
      <div className="mb-4 space-y-3 rounded-xl border border-border bg-white p-3 sm:p-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Search name, phone, village, notes…"
            value={filters.search ?? ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            value={filters.village ?? "all"}
            onValueChange={(v) => setFilters({ ...filters, village: v })}
          >
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
            value={filters.status ?? "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                status: v as AccessRequestFilters["status"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ACCESS_REQUEST_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {ACCESS_REQUEST_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.providerId ?? "all"}
            onValueChange={(v) => setFilters({ ...filters, providerId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All providers</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {providers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <Input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            placeholder="From"
          />
          <Input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <Select
            value={filters.urgency ?? "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                urgency: v as AccessRequestFilters["urgency"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All urgency</SelectItem>
              {REQUEST_URGENCIES.map((u) => (
                <SelectItem key={u} value={u}>
                  {URGENCY_LABELS[u]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.paymentStatus ?? "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                paymentStatus: v as AccessRequestFilters["paymentStatus"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {PAYMENT_STATUSES.map((p) => (
                <SelectItem key={p} value={p}>
                  {PAYMENT_STATUS_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.vip ?? "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                vip: v as "all" | "yes" | "no",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="VIP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">VIP: All</SelectItem>
              <SelectItem value="yes">VIP only</SelectItem>
              <SelectItem value="no">Non-VIP</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.blacklisted ?? "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                blacklisted: v as "all" | "yes" | "no",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Blacklist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Blacklist: All</SelectItem>
              <SelectItem value="yes">Blacklisted</SelectItem>
              <SelectItem value="no">Clear</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as RequestSortOption)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {REQUEST_SORT_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {requests.length} requests
        </p>
      </div>

      <div className="space-y-3 lg:hidden">
        {filtered.map((req) => (
          <div
            key={req.id}
            className={cn(
              "rounded-xl border bg-white p-4",
              isUrgentRequest(req.urgency) && "border-orange-300 ring-1 ring-orange-200",
              req.is_vip && "border-amber-200"
            )}
          >
            <div className="flex justify-between gap-2">
              <div>
                <p className="font-semibold">{req.full_name}</p>
                <RequestRowBadges req={req} />
              </div>
              <CountdownBadge accessDate={req.access_date} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {req.village} · {formatDate(req.access_date)} · {req.access_type}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={req.status}>{req.status}</Badge>
              <Badge variant="outline">{PAYMENT_STATUS_LABELS[req.payment_status]}</Badge>
            </div>
            <p className="mt-2 text-xs">
              Profit: {formatCurrency(req.platform_profit)}
            </p>
            <div className="mt-2">
              <AdminNotesCell
                value={req.admin_notes}
                onSave={(n) => saveInlineNotes(req.id, n)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <WhatsAppButton phone={req.phone} />
              <Button variant="outline" size="sm" onClick={() => openEdit(req)}>
                Manage
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBlacklist(req)}
              >
                {req.is_blacklisted ? "Unblacklist" : "Blacklist"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
        <table className="w-full min-w-[1400px] text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Countdown</th>
              <th className="px-3 py-2 font-medium">Village / Date</th>
              <th className="px-3 py-2 font-medium">Access</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Urgency</th>
              <th className="px-3 py-2 font-medium">Revenue</th>
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Provider</th>
              <th className="px-3 py-2 font-medium min-w-[180px]">Admin notes</th>
              <th className="px-3 py-2 font-medium">Contact</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((req) => (
              <tr
                key={req.id}
                className={cn(
                  "bg-card hover:bg-muted/20",
                  isUrgentRequest(req.urgency) && "bg-orange-50/50",
                  req.is_vip && "bg-amber-50/30"
                )}
              >
                <td className="px-3 py-2">
                  <div className="font-medium">{req.full_name}</div>
                  <RequestRowBadges req={req} />
                  {req.customer_notes ? (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1" title={req.customer_notes}>
                      C: {truncateText(req.customer_notes, 40)}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <CountdownBadge accessDate={req.access_date} />
                </td>
                <td className="px-3 py-2">
                  {req.village}
                  <br />
                  <span className="text-muted-foreground">
                    {formatDate(req.access_date)} · {req.people_count}p
                  </span>
                </td>
                <td className="px-3 py-2">{req.access_type}</td>
                <td className="px-3 py-2">
                  <Badge variant={req.status}>{req.status}</Badge>
                </td>
                <td className="px-3 py-2 text-xs">
                  {URGENCY_LABELS[req.urgency]}
                </td>
                <td className="px-3 py-2 text-xs">
                  <div>{formatCurrency(req.customer_price)}</div>
                  <div className="text-muted-foreground">
                    P: {formatCurrency(req.provider_payout)}
                  </div>
                  <div className="font-semibold text-emerald-700">
                    {formatCurrency(req.platform_profit)}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Badge variant={req.payment_status}>
                    {PAYMENT_STATUS_LABELS[req.payment_status]}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  {req.provider?.full_name ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <AdminNotesCell
                    value={req.admin_notes}
                    onSave={(n) => saveInlineNotes(req.id, n)}
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="text-xs">{req.phone}</div>
                  <WhatsAppButton phone={req.phone} label="WA" />
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" onClick={() => openEdit(req)}>
                      Manage
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => toggleBlacklist(req)}
                    >
                      {req.is_blacklisted ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage — {editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <p>
                  {editing.village} · {formatDate(editing.access_date)} ·{" "}
                  {editing.access_type} · {editing.people_count} people
                </p>
                <CountdownBadge accessDate={editing.access_date} />
                {editing.customer_notes ? (
                  <p className="text-muted-foreground">
                    Customer: {editing.customer_notes}
                  </p>
                ) : null}
                <WhatsAppButton phone={editing.phone} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Status</label>
                  <Select value={status} onValueChange={(v) => setStatus(v as AccessRequestStatus)}>
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
                <div className="space-y-1">
                  <label className="text-xs font-medium">Urgency</label>
                  <Select value={urgency} onValueChange={(v) => setUrgency(v as RequestUrgency)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REQUEST_URGENCIES.map((u) => (
                        <SelectItem key={u} value={u}>
                          {URGENCY_LABELS[u]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">
                  Assign provider ({compatibleProviders.length} compatible)
                </label>
                <Select value={providerId} onValueChange={setProviderId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {compatibleProviders.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} · {p.reliability_score}% ·{" "}
                        {p.available_from
                          ? `${p.available_from}–${p.available_to ?? "∞"}`
                          : "Always"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {compatibleProviders.length === 0 ? (
                  <p className="text-xs text-amber-700">
                    No compatible active providers for this village, access type, and date.
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Customer price</label>
                  <Input
                    type="number"
                    value={customerPrice}
                    onChange={(e) => setCustomerPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Provider payout</label>
                  <Input
                    type="number"
                    value={providerPayout}
                    onChange={(e) => setProviderPayout(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Payment</label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_STATUSES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {PAYMENT_STATUS_LABELS[p]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip"
                  checked={isVip}
                  onChange={(e) => setIsVip(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="vip" className="text-sm font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" /> VIP customer
                </label>
              </div>
              {isVip ? (
                <Textarea
                  value={vipNotes}
                  onChange={(e) => setVipNotes(e.target.value)}
                  placeholder="VIP notes"
                  rows={2}
                />
              ) : null}

              <div className="space-y-1">
                <label className="text-xs font-medium">Admin notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button variant="navy" className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
