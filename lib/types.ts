import type {
  AccessRequestStatus,
  ProviderApplicationStatus,
  ProviderStatus,
} from "@/lib/constants";

export interface AccessRequest {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  village: string;
  access_date: string;
  people_count: number;
  car_access: boolean;
  notes: string | null;
  status: AccessRequestStatus;
  assigned_provider_id: string | null;
  admin_notes: string | null;
  created_at: string;
}

export interface AccessRequestWithProvider extends AccessRequest {
  provider?: Provider | null;
}

export interface ProviderApplication {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  villages: string[];
  access_types: string[];
  average_pricing: string | null;
  availability_notes: string | null;
  status: ProviderApplicationStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface Provider {
  id: string;
  full_name: string;
  phone: string;
  whatsapp: string;
  villages: string[];
  access_types: string[];
  average_pricing: string | null;
  rating: number | null;
  notes: string | null;
  status: ProviderStatus;
  created_at: string;
}

export interface CreateAccessRequestInput {
  full_name: string;
  phone: string;
  whatsapp: string;
  village: string;
  access_date: string;
  people_count: number;
  car_access: boolean;
  notes?: string;
}

export interface CreateProviderApplicationInput {
  full_name: string;
  phone: string;
  whatsapp: string;
  villages: string[];
  access_types: string[];
  average_pricing?: string;
  availability_notes?: string;
}

export interface UpdateAccessRequestInput {
  id: string;
  status?: AccessRequestStatus;
  assigned_provider_id?: string | null;
  admin_notes?: string | null;
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
  whatsapp?: string;
  villages?: string[];
  access_types?: string[];
  average_pricing?: string | null;
  rating?: number | null;
  notes?: string | null;
  status?: ProviderStatus;
}

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export interface AdminDashboardData {
  accessRequests: AccessRequestWithProvider[];
  providerApplications: ProviderApplication[];
  providers: Provider[];
}
