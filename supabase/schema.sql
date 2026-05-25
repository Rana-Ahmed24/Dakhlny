-- Dakhlny Guest Access Platform Schema (full)
-- Run in Supabase SQL Editor for new projects.
-- Existing DBs: run migrations/002_operational_upgrade.sql instead.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE access_request_status AS ENUM (
  'pending',
  'contacted',
  'confirmed',
  'completed',
  'cancelled',
  'failed'
);

CREATE TYPE provider_application_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE provider_status AS ENUM (
  'active',
  'inactive'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'partial',
  'refunded',
  'failed'
);

CREATE TYPE request_urgency AS ENUM (
  'low',
  'medium',
  'high',
  'urgent',
  'standing_at_gate'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'bank_transfer',
  'instapay',
  'vodafone_cash',
  'other'
);

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  villages TEXT[] NOT NULL DEFAULT '{}',
  access_types TEXT[] NOT NULL DEFAULT '{}',
  average_pricing TEXT,
  rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
  provider_notes TEXT,
  admin_notes TEXT,
  available_from DATE,
  available_to DATE,
  status provider_status NOT NULL DEFAULT 'active',
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,
  blacklisted_at TIMESTAMPTZ,
  blacklisted_by TEXT,
  successful_requests INTEGER NOT NULL DEFAULT 0,
  failed_requests INTEGER NOT NULL DEFAULT 0,
  cancelled_requests INTEGER NOT NULL DEFAULT 0,
  reliability_score NUMERIC(5, 2) NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  access_date DATE NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'Guest access',
  people_count INTEGER NOT NULL CHECK (people_count > 0),
  customer_notes TEXT,
  status access_request_status NOT NULL DEFAULT 'pending',
  assigned_provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  admin_notes TEXT,
  customer_price NUMERIC(12, 2),
  provider_payout NUMERIC(12, 2),
  platform_profit NUMERIC(12, 2),
  payment_status payment_status NOT NULL DEFAULT 'pending',
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  vip_notes TEXT,
  urgency request_urgency NOT NULL DEFAULT 'medium',
  is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  blacklist_reason TEXT,
  blacklisted_at TIMESTAMPTZ,
  blacklisted_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  villages TEXT[] NOT NULL DEFAULT '{}',
  access_types TEXT[] NOT NULL DEFAULT '{}',
  average_pricing TEXT,
  provider_notes TEXT,
  available_from DATE,
  available_to DATE,
  status provider_application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES access_requests(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  village TEXT NOT NULL,
  customer_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  provider_paid NUMERIC(12, 2) NOT NULL DEFAULT 0,
  platform_profit NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method payment_method,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  admin TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  field_name TEXT,
  previous_value TEXT,
  new_value TEXT,
  admin TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_requests_status ON access_requests(status);
CREATE INDEX idx_access_requests_created_at ON access_requests(created_at DESC);
CREATE INDEX idx_access_requests_village ON access_requests(village);
CREATE INDEX idx_access_requests_payment_status ON access_requests(payment_status);
CREATE INDEX idx_access_requests_urgency ON access_requests(urgency);
CREATE INDEX idx_access_requests_access_date ON access_requests(access_date);
CREATE INDEX idx_access_requests_assigned_provider ON access_requests(assigned_provider_id);
CREATE INDEX idx_access_requests_blacklisted ON access_requests(is_blacklisted);
CREATE INDEX idx_access_requests_vip ON access_requests(is_vip);
CREATE INDEX idx_provider_applications_status ON provider_applications(status);
CREATE INDEX idx_provider_applications_created_at ON provider_applications(created_at DESC);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_blacklisted ON providers(is_blacklisted);
CREATE INDEX idx_transaction_logs_created_at ON transaction_logs(created_at DESC);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert access requests"
  ON access_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can insert provider applications"
  ON provider_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON access_requests TO anon, authenticated;
GRANT INSERT ON provider_applications TO anon, authenticated;
GRANT ALL ON access_requests TO service_role;
GRANT ALL ON provider_applications TO service_role;
GRANT ALL ON providers TO service_role;
GRANT ALL ON transaction_logs TO service_role;
GRANT ALL ON audit_logs TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
