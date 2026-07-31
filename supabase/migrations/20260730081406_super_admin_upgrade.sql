-- ===========================================================
-- SUPER ADMIN SCHEMA UPGRADE
-- ===========================================================

-------------------------------------------------------------
-- PLATFORM SETTINGS
-------------------------------------------------------------

ALTER TABLE platform_settings
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_approve_products BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS auto_approve_sellers BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS razorpay_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS upi_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS cod_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS max_products_per_seller INTEGER DEFAULT 100;

-------------------------------------------------------------
-- CATEGORY COMMISSIONS
-------------------------------------------------------------

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS take_rate NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS min_fee_cap NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS max_fee_cap NUMERIC(10,2);

-------------------------------------------------------------
-- ACCOUNT STATUS ENUM
-------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'account_status'
    ) THEN
        CREATE TYPE account_status AS ENUM (
            'active',
            'suspended',
            'blocked'
        );
    END IF;
END $$;

-------------------------------------------------------------
-- PROFILE STATUS
-------------------------------------------------------------

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS status account_status NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS two_fa_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-------------------------------------------------------------
-- ROLE ENHANCEMENT
-------------------------------------------------------------

ALTER TABLE roles
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_system_role BOOLEAN NOT NULL DEFAULT FALSE;

-------------------------------------------------------------
-- PERMISSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS permissions (

    id SERIAL PRIMARY KEY,

    name TEXT NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()

);

-------------------------------------------------------------
-- ROLE PERMISSIONS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS role_permissions (

    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,

    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,

    PRIMARY KEY (role_id, permission_id)

);

-------------------------------------------------------------
-- DEFAULT PERMISSIONS
-------------------------------------------------------------

INSERT INTO permissions (name, description)
VALUES
('dashboard.read','View dashboard'),
('dashboard.write','Manage dashboard'),

('users.read','View users'),
('users.write','Manage users'),

('products.read','View products'),
('products.write','Manage products'),

('orders.read','View orders'),
('orders.write','Manage orders'),

('categories.read','View categories'),
('categories.write','Manage categories'),

('settings.read','View settings'),
('settings.write','Manage settings'),

('roles.read','View roles'),
('roles.write','Manage roles'),

('admins.read','View admins'),
('admins.write','Manage admins'),

('reports.read','View reports'),

('partner_api.read','View Partner APIs'),
('partner_api.write','Manage Partner APIs')

ON CONFLICT (name) DO NOTHING;

-------------------------------------------------------------
-- PARTNER API KEYS
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS partner_api_keys (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    key_hash TEXT NOT NULL,

    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    last_used_at TIMESTAMPTZ,

    revoked_at TIMESTAMPTZ,

    is_active BOOLEAN NOT NULL DEFAULT TRUE

);

-------------------------------------------------------------
-- ADMIN ACTIVITY LOG
-------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_activity_log (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

    action TEXT NOT NULL,

    target_type TEXT,

    target_id UUID,

    details JSONB,

    ip_address TEXT,

    user_agent TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()

);

-------------------------------------------------------------
-- INDEXES
-------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_status
ON profiles(status);

CREATE INDEX IF NOT EXISTS idx_partner_api_active
ON partner_api_keys(is_active);

CREATE INDEX IF NOT EXISTS idx_categories_take_rate
ON categories(take_rate);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin
ON admin_activity_log(admin_id);

CREATE INDEX IF NOT EXISTS idx_admin_activity_action
ON admin_activity_log(action);

CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at
ON admin_activity_log(created_at DESC);