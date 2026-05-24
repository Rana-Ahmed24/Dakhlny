-- Run this in Supabase SQL Editor if you get "permission denied for table"
-- Safe to run on an existing database

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT INSERT ON access_requests TO anon, authenticated;
GRANT INSERT ON provider_applications TO anon, authenticated;

GRANT ALL ON access_requests TO service_role;
GRANT ALL ON provider_applications TO service_role;
GRANT ALL ON providers TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
