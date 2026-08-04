-- Add password_hash column to sellers for platform-level password verification.
-- This is separate from Supabase Auth passwords — used for confirming identity
-- before sensitive operations (e.g., payouts, account changes).
-- Nullable: not all sellers need a separate hash.

ALTER TABLE sellers ADD COLUMN IF NOT EXISTS password_hash TEXT;
