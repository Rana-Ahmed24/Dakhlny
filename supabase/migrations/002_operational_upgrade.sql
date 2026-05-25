-- Dakhlny operational upgrade migration
-- Safe to run on existing databases. Run in Supabase SQL Editor.

-- New enums
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending', 'paid', 'partial', 'refunded', 'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE request_urgency AS ENUM (
    'low', 'medium', 'high', 'urgent', 'standing_at_gate'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM (
    'cash', 'bank_transfer', 'instapay', 'vodafone_cash', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add failed status to access requests
ALTER TYPE access_request_status ADD VALUE IF NOT EXISTS 'failed';

-- ---------------------------------------------------------------------------
-- access_requests
-- ---------------------------------------------------------------------------
ALTER TABLE access_requests
  ADD COLUMN IF NOT EXISTS access_type TEXT NOT NULL DEFAULT 'Guest access',
  ADD COLUMN IF NOT EXISTS customer_notes TEXT,
  ADD COLUMN IF NOT EXISTS customer_price NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS provider_payout NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS platform_profit NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS payment_status payment_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS vip_notes TEXT,
  ADD COLUMN IF NOT EXISTS urgency request_urgency NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS blacklist_reason TEXT,
  ADD COLUMN IF NOT EXISTS blacklisted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS blacklisted_by TEXT;

-- Migrate legacy data
UPDATE access_requests
SET access_type = CASE WHEN car_access THEN 'Car access' ELSE 'Guest access' END
WHERE access_type IS NULL OR access_type = 'Guest access';

UPDATE access_requests
SET customer_notes = notes
WHERE customer_notes IS NULL AND notes IS NOT NULL;

UPDATE access_requests
SET phone = COALESCE(NULLIF(TRIM(phone), ''), NULLIF(TRIM(whatsapp), ''))
WHERE whatsapp IS NOT NULL;

UPDATE access_requests
SET platform_profit = customer_price - provider_payout
WHERE customer_price IS NOT NULL
  AND provider_payout IS NOT NULL
  AND platform_profit IS NULL;

-- Drop legacy columns after migration
ALTER TABLE access_requests DROP COLUMN IF EXISTS whatsapp;
ALTER TABLE access_requests DROP COLUMN IF EXISTS car_access;
ALTER TABLE access_requests DROP COLUMN IF EXISTS notes;

-- ---------------------------------------------------------------------------
-- providers
-- ---------------------------------------------------------------------------
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS provider_notes TEXT,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS available_to DATE,
  ADD COLUMN IF NOT EXISTS is_blacklisted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS blacklist_reason TEXT,
  ADD COLUMN IF NOT EXISTS blacklisted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS blacklisted_by TEXT,
  ADD COLUMN IF NOT EXISTS successful_requests INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS failed_requests INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancelled_requests INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reliability_score NUMERIC(5, 2) NOT NULL DEFAULT 100;

UPDATE providers
SET phone = COALESCE(NULLIF(TRIM(phone), ''), NULLIF(TRIM(whatsapp), ''))
WHERE whatsapp IS NOT NULL;

UPDATE providers
SET provider_notes = notes
WHERE provider_notes IS NULL AND notes IS NOT NULL;

ALTER TABLE providers DROP COLUMN IF EXISTS whatsapp;
ALTER TABLE providers DROP COLUMN IF EXISTS notes;

-- ---------------------------------------------------------------------------
-- provider_applications
-- ---------------------------------------------------------------------------
ALTER TABLE provider_applications
  ADD COLUMN IF NOT EXISTS provider_notes TEXT,
  ADD COLUMN IF NOT EXISTS available_from DATE,
  ADD COLUMN IF NOT EXISTS available_to DATE;

UPDATE provider_applications
SET phone = COALESCE(NULLIF(TRIM(phone), ''), NULLIF(TRIM(whatsapp), ''))
WHERE whatsapp IS NOT NULL;

UPDATE provider_applications
SET provider_notes = availability_notes
WHERE provider_notes IS NULL AND availability_notes IS NOT NULL;

ALTER TABLE provider_applications DROP COLUMN IF EXISTS whatsapp;
ALTER TABLE provider_applications DROP COLUMN IF EXISTS availability_notes;

-- ---------------------------------------------------------------------------
-- transaction_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transaction_logs (
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

CREATE INDEX IF NOT EXISTS idx_transaction_logs_created_at
  ON transaction_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_request_id
  ON transaction_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_transaction_logs_provider_id
  ON transaction_logs(provider_id);

-- ---------------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
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

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON audit_logs(entity_type, entity_id);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_access_requests_payment_status
  ON access_requests(payment_status);
CREATE INDEX IF NOT EXISTS idx_access_requests_urgency
  ON access_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_access_requests_access_date
  ON access_requests(access_date);
CREATE INDEX IF NOT EXISTS idx_access_requests_assigned_provider
  ON access_requests(assigned_provider_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_blacklisted
  ON access_requests(is_blacklisted);
CREATE INDEX IF NOT EXISTS idx_access_requests_vip
  ON access_requests(is_vip);
CREATE INDEX IF NOT EXISTS idx_providers_blacklisted
  ON providers(is_blacklisted);

-- Grants
GRANT ALL ON transaction_logs TO service_role;
GRANT ALL ON audit_logs TO service_role;
