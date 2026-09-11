-- Add is_blocked to profiles for Customer management
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;

-- Enhance delivery_partners table
ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_delivery', 'suspended'));
