import type {
  AccessRequestStatus,
  AccessType,
  PaymentMethod,
  PaymentStatus,
  ProviderApplicationStatus,
  ProviderStatus,
  RequestUrgency,
} from "@/lib/constants";

export interface AccessRequest {
  id: string;
  full_name: string;
  phone: string;
  village: string;
  access_date: string;
  access_type: AccessType;
  people_count: number;
  customer_notes: string | null;
  status: AccessRequestStatus;
  assigned_provider_id: string | null;
  admin_notes: string | null;
  customer_price: number | null;
  provider_payout: number | null;
  platform_profit: number | null;
  payment_status: PaymentStatus;
  is_vip: boolean;
  vip_notes: string | null;
  urgency: RequestUrgency;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  blacklisted_at: string | null;
  blacklisted_by: string | null;
  created_at: string;
}

export interface AccessRequestWithProvider extends AccessRequest {
  provider?: Provider | null;
}

export interface ProviderApplication {
  id: string;
  full_name: string;
  phone: string;
  villages: string[];
  access_types: string[];
  average_pricing: string | null;
  provider_notes: string | null;
  available_from: string | null;
  available_to: string | null;
  status: ProviderApplicationStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  full_name: string;
  phone: string;
  villages: string[];
  access_types: string[];
  average_pricing: string | null;
  rating: number | null;
  provider_notes: string | null;
  admin_notes: string | null;
  available_from: string | null;
  available_to: string | null;
  status: ProviderStatus;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  blacklisted_at: string | null;
  blacklisted_by: string | null;
  successful_requests: number;
  failed_requests: number;
  cancelled_requests: number;
  reliability_score: number;
  created_at: string;
}

export interface ProviderWithStats extends Provider {
  total_earnings: number;
  total_completed: number;
  average_payout: number;
  last_completed_at: string | null;
  recent_customers: string[];
}

export interface TransactionLog {
  id: string;
  request_id: string | null;
  provider_id: string | null;
  customer_name: string;
  village: string;
  customer_paid: number;
  provider_paid: number;
  platform_profit: number;
  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  admin: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  field_name: string | null;
  previous_value: string | null;
  new_value: string | null;
  admin: string;
  created_at: string;
}

export interface CreateAccessRequestInput {
  full_name: string;
  phone: string;
  village: string;
  access_date: string;
  access_type: AccessType;
  people_count: number;
  customer_notes?: string;
}

export interface CreateProviderApplicationInput {
  full_name: string;
  phone: string;
  villages: string[];
  access_types: string[];
  average_pricing?: string;
  provider_notes?: string;
  available_from?: string;
  available_to?: string;
}

export interface UpdateAccessRequestInput {
  id: string;
  status?: AccessRequestStatus;
  assigned_provider_id?: string | null;
  admin_notes?: string | null;
  customer_notes?: string | null;
  access_type?: AccessType;
  customer_price?: number | null;
  provider_payout?: number | null;
  payment_status?: PaymentStatus;
  is_vip?: boolean;
  vip_notes?: string | null;
  urgency?: RequestUrgency;
  is_blacklisted?: boolean;
  blacklist_reason?: string | null;
}

export interface UpdateProviderApplicationInput {
  id: string;
  status?: ProviderApplicationStatus;
  admin_notes?: string | null;
}

export interface UpdateProviderInput {
  id: string;
  full_name?: string;
  phone?: string;
  villages?: string[];
  access_types?: string[];
  average_pricing?: string | null;
  rating?: number | null;
  provider_notes?: string | null;
  admin_notes?: string | null;
  available_from?: string | null;
  available_to?: string | null;
  status?: ProviderStatus;
  is_blacklisted?: boolean;
  blacklist_reason?: string | null;
}

export interface PlatformAnalytics {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingPayments: number;
  completedRequests: number;
  failedRequests: number;
  cancelledRequests: number;
  topVillages: { village: string; count: number; revenue: number }[];
  topProviders: { providerId: string; name: string; revenue: number; count: number }[];
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface AdminDashboardData {
  accessRequests: AccessRequestWithProvider[];
  providerApplications: ProviderApplication[];
  providers: Provider[];
  transactionLogs: TransactionLog[];
  auditLogs: AuditLog[];
  analytics: PlatformAnalytics;
}
