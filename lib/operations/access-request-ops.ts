import type {
  AccessRequestStatus,
  AccessType,
  PaymentStatus,
  RequestSortOption,
  RequestUrgency,
} from "@/lib/constants";
import type { AccessRequestWithProvider, Provider } from "@/lib/types";

export interface AccessRequestFilters {
  search?: string;
  village?: string;
  status?: AccessRequestStatus | "all";
  providerId?: string | "all" | "unassigned";
  dateFrom?: string;
  dateTo?: string;
  blacklisted?: "all" | "yes" | "no";
  vip?: "all" | "yes" | "no";
  paymentStatus?: PaymentStatus | "all";
  urgency?: RequestUrgency | "all";
  accessType?: AccessType | "all";
}

export function normalizeAccessTypes(types: string[]): string[] {
  const allowed = new Set(["Guest access", "Car access"]);
  return types.filter((t) => allowed.has(t));
}

export function villageMatches(providerVillages: string[], requestVillage: string): boolean {
  const normalized = requestVillage.trim().toLowerCase();
  return providerVillages.some(
    (v) =>
      v.trim().toLowerCase() === normalized ||
      normalized.includes(v.trim().toLowerCase()) ||
      v.trim().toLowerCase().includes(normalized)
  );
}

export function providerSupportsAccessType(
  provider: Provider,
  accessType: AccessType
): boolean {
  const types = normalizeAccessTypes(provider.access_types);
  return types.includes(accessType);
}

export function providerAvailableForDate(
  provider: Provider,
  accessDate: string
): boolean {
  if (provider.available_from && accessDate < provider.available_from) return false;
  if (provider.available_to && accessDate > provider.available_to) return false;
  return true;
}

export function getCompatibleProviders(
  providers: Provider[],
  request: Pick<
    AccessRequestWithProvider,
    "village" | "access_date" | "access_type"
  >
): Provider[] {
  return providers.filter(
    (p) =>
      p.status === "active" &&
      !p.is_blacklisted &&
      villageMatches(p.villages, request.village) &&
      providerSupportsAccessType(p, request.access_type) &&
      providerAvailableForDate(p, request.access_date)
  );
}

export function calcPlatformProfit(
  customerPrice: number | null,
  providerPayout: number | null
): number | null {
  if (customerPrice == null || providerPayout == null) return null;
  return Number((customerPrice - providerPayout).toFixed(2));
}

export function getAccessCountdown(accessDate: string): {
  label: string;
  tone: "expired" | "critical" | "soon" | "normal";
} {
  const now = new Date();
  const target = new Date(`${accessDate}T08:00:00`);
  const diffMs = target.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const pastDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    return {
      label: pastDays === 0 ? "Expired" : `Expired ${pastDays}d ago`,
      tone: "expired",
    };
  }

  if (diffHours <= 2) {
    const hours = Math.max(1, Math.ceil(diffHours));
    return {
      label: hours === 1 ? "Starts in 1 hour" : `Starts in ${hours} hours`,
      tone: "critical",
    };
  }

  if (diffDays <= 1) {
    return { label: "Tomorrow", tone: "critical" };
  }

  if (diffDays <= 3) {
    return {
      label: `${diffDays} days remaining`,
      tone: "soon",
    };
  }

  return {
    label: `${diffDays} days remaining`,
    tone: "normal",
  };
}

export function filterAccessRequests(
  requests: AccessRequestWithProvider[],
  filters: AccessRequestFilters
): AccessRequestWithProvider[] {
  return requests.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const hay = `${r.full_name} ${r.phone} ${r.village} ${r.admin_notes ?? ""} ${r.customer_notes ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.village && filters.village !== "all" && r.village !== filters.village)
      return false;
    if (filters.status && filters.status !== "all" && r.status !== filters.status)
      return false;
    if (filters.providerId === "unassigned" && r.assigned_provider_id) return false;
    if (
      filters.providerId &&
      filters.providerId !== "all" &&
      filters.providerId !== "unassigned" &&
      r.assigned_provider_id !== filters.providerId
    )
      return false;
    if (filters.dateFrom && r.access_date < filters.dateFrom) return false;
    if (filters.dateTo && r.access_date > filters.dateTo) return false;
    if (filters.blacklisted === "yes" && !r.is_blacklisted) return false;
    if (filters.blacklisted === "no" && r.is_blacklisted) return false;
    if (filters.vip === "yes" && !r.is_vip) return false;
    if (filters.vip === "no" && r.is_vip) return false;
    if (
      filters.paymentStatus &&
      filters.paymentStatus !== "all" &&
      r.payment_status !== filters.paymentStatus
    )
      return false;
    if (filters.urgency && filters.urgency !== "all" && r.urgency !== filters.urgency)
      return false;
    if (
      filters.accessType &&
      filters.accessType !== "all" &&
      r.access_type !== filters.accessType
    )
      return false;
    return true;
  });
}

export function sortAccessRequests(
  requests: AccessRequestWithProvider[],
  sort: RequestSortOption
): AccessRequestWithProvider[] {
  const copy = [...requests];
  switch (sort) {
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    case "upcoming_date":
      return copy.sort(
        (a, b) =>
          new Date(a.access_date).getTime() - new Date(b.access_date).getTime()
      );
    case "highest_revenue":
      return copy.sort(
        (a, b) => (b.platform_profit ?? 0) - (a.platform_profit ?? 0)
      );
    case "status":
      return copy.sort((a, b) => a.status.localeCompare(b.status));
    case "urgency": {
      const order: RequestUrgency[] = [
        "standing_at_gate",
        "urgent",
        "high",
        "medium",
        "low",
      ];
      return copy.sort(
        (a, b) => order.indexOf(a.urgency) - order.indexOf(b.urgency)
      );
    }
    case "newest":
    default:
      return copy.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

export function urgencyRank(urgency: RequestUrgency): number {
  const order: RequestUrgency[] = [
    "standing_at_gate",
    "urgent",
    "high",
    "medium",
    "low",
  ];
  return order.indexOf(urgency);
}

export function isUrgentRequest(urgency: RequestUrgency): boolean {
  return urgency === "urgent" || urgency === "standing_at_gate" || urgency === "high";
}
