-- Dakhlny Guest Access Platform Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Access request statuses
CREATE TYPE access_request_status AS ENUM (
  'pending',
  'contacted',
  'confirmed',
  'completed',
  'cancelled'
);

-- Provider application statuses
CREATE TYPE provider_application_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

-- Provider statuses
CREATE TYPE provider_status AS ENUM (
  'active',
  'inactive'
);

-- Approved providers (internal admin use only)
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  villages TEXT[] NOT NULL DEFAULT '{}',
  access_types TEXT[] NOT NULL DEFAULT '{}',
  average_pricing TEXT,
  rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  status provider_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guest access requests
CREATE TABLE access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  village TEXT NOT NULL,
  access_date DATE NOT NULL,
  people_count INTEGER NOT NULL CHECK (people_count > 0),
  car_access BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  status access_request_status NOT NULL DEFAULT 'pending',
  assigned_provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Provider applications
CREATE TABLE provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  villages TEXT[] NOT NULL DEFAULT '{}',
  access_types TEXT[] NOT NULL DEFAULT '{}',
  average_pricing TEXT,
  availability_notes TEXT,
  status provider_application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for admin dashboard performance
CREATE INDEX idx_access_requests_status ON access_requests(status);
CREATE INDEX idx_access_requests_created_at ON access_requests(created_at DESC);
CREATE INDEX idx_access_requests_village ON access_requests(village);
CREATE INDEX idx_provider_applications_status ON provider_applications(status);
CREATE INDEX idx_provider_applications_created_at ON provider_applications(created_at DESC);
CREATE INDEX idx_providers_status ON providers(status);
CREATE INDEX idx_providers_created_at ON providers(created_at DESC);

-- Row Level Security
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Public can insert access requests and provider applications
CREATE POLICY "Public can insert access requests"
  ON access_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can insert provider applications"
  ON provider_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Table-level grants (required for anon/authenticated roles in Supabase)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT INSERT ON access_requests TO anon, authenticated;
GRANT INSERT ON provider_applications TO anon, authenticated;

GRANT ALL ON access_requests TO service_role;
GRANT ALL ON provider_applications TO service_role;
GRANT ALL ON providers TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Service role (used by server actions) has full access via service key
-- No public SELECT policies — admin reads via service role only
