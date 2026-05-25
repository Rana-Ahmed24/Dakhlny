export const SUPPORTED_VILLAGES = [
  "Marina",
  "Marassi",
  "Hacienda",
  "Hacienda White",
  "Amwaj",
  "Sidi Abdel Rahman",
  "Telal",
  "Stella",
  "La Vista",
  "Mountain View",
  "Jefaira",
  "Silversands",
  "Caesar",
  "Other",
] as const;

export type Village = (typeof SUPPORTED_VILLAGES)[number];

export const ACCESS_TYPES = ["Guest access", "Car access"] as const;

export type AccessType = (typeof ACCESS_TYPES)[number];

export const ACCESS_REQUEST_STATUSES = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
  "failed",
] as const;

export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "partial",
  "refunded",
  "failed",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_METHODS = [
  "cash",
  "bank_transfer",
  "instapay",
  "vodafone_cash",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const REQUEST_URGENCIES = [
  "low",
  "medium",
  "high",
  "urgent",
  "standing_at_gate",
] as const;

export type RequestUrgency = (typeof REQUEST_URGENCIES)[number];

export const PROVIDER_APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ProviderApplicationStatus =
  (typeof PROVIDER_APPLICATION_STATUSES)[number];

export const PROVIDER_STATUSES = ["active", "inactive"] as const;

export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

export const ACCESS_REQUEST_STATUS_LABELS: Record<AccessRequestStatus, string> =
  {
    pending: "Pending",
    contacted: "Contacted",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    failed: "Failed",
  };

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  partial: "Partial",
  refunded: "Refunded",
  failed: "Failed",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  instapay: "InstaPay",
  vodafone_cash: "Vodafone Cash",
  other: "Other",
};

export const URGENCY_LABELS: Record<RequestUrgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
  standing_at_gate: "Standing At Gate",
};

export const PROVIDER_APPLICATION_STATUS_LABELS: Record<
  ProviderApplicationStatus,
  string
> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const PROVIDER_STATUS_LABELS: Record<ProviderStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};

export const REQUEST_SORT_OPTIONS = [
  "newest",
  "oldest",
  "upcoming_date",
  "highest_revenue",
  "status",
  "urgency",
] as const;

export type RequestSortOption = (typeof REQUEST_SORT_OPTIONS)[number];

export const ADMIN_ACTOR = "admin";

export const SITE_NAME = "Dakhlny";
export const SITE_DESCRIPTION =
  "Premium guest access coordination for North Coast Egypt villages.";
