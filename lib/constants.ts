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

export const ACCESS_TYPES = [
  "Guest access",
  "Car access",
  "Day use",
  "Event access",
] as const;

export type AccessType = (typeof ACCESS_TYPES)[number];

export const ACCESS_REQUEST_STATUSES = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AccessRequestStatus = (typeof ACCESS_REQUEST_STATUSES)[number];

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

export const SITE_NAME = "Dakhlny";
export const SITE_DESCRIPTION =
  "Premium guest access coordination for North Coast Egypt villages.";
