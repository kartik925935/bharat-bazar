-- =============================================================================
-- TASK 5: Security & Admin Layer Hardening
-- Migration: 20260906165000_security_admin_layer.sql
-- Project: Bharat Bazaar
-- =============================================================================
-- ROW COUNTS AT AUTHORING TIME (verified via MCP):
--   roles: 5 | user_roles: 27 | permissions: 19 | role_permissions: 0
--   admin_activity_log: 0 | admin_audit_logs: 0 | seller_documents: 13
--   sa_admins: [NEW] | sa_panel_access_grants: [NEW]
--   sa_panel_access_requests: [NEW] | sa_trusted_devices: [NEW]
-- =============================================================================
-- ALL CHANGES ARE:
--   (a) ADDITIVE - no existing column/table/data is dropped or modified
--       except seller_documents (additive columns only) and the
--       handle_new_user function (security fix) and is_system_role flags.
--   (b) IDEMPOTENT - every block uses IF NOT EXISTS / ON CONFLICT / DO NOTHING
--       / EXCEPTION guards so re-running is safe.
-- =============================================================================

BEGIN;

-- =============================================================================
-- SECTION A: HARDEN handle_new_user - HIGHEST PRIORITY
-- Closes the privilege-escalation hole where an attacker could sign up with
-- raw_user_meta_data->>'role' = 'admin' or 'super_admin' and receive that role.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $handle_new_user$
DECLARE
  _role_name     text;
  _role_id       int;
  _full_name     text;
  _seller_uuid   uuid;
  _seller_id     text;
  _username      text;
  _seller_type   text;
  _requested_role text;
BEGIN
  -- SECURITY: whitelist-only role assignment
  -- ONLY 'customer', 'seller', 'delivery_partner' may be self-assigned via
  -- signup metadata. admin/super_admin MUST be granted out-of-band by an
  -- existing super_admin via sa_admins + user_roles.
  _requested_role := NEW.raw_user_meta_data ->> 'role';

  IF _requested_role IS NOT NULL
     AND _requested_role NOT IN ('customer', 'seller', 'delivery_partner')
  THEN
    RAISE LOG
      'handle_new_user: SECURITY - blocked role escalation attempt. user_id=% attempted role=%. Falling back to customer.',
      NEW.id, _requested_role;
  END IF;

  _role_name := CASE
    WHEN _requested_role IN ('customer', 'seller', 'delivery_partner')
    THEN _requested_role
    ELSE 'customer'
  END;

  -- Build full name from metadata
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    CONCAT_WS(' ',
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name'
    ),
    NEW.raw_user_meta_data ->> 'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert profile (skip if already exists)
  INSERT INTO public.profiles (id, full_name, phone, avatar_url, status)
  VALUES (
    NEW.id,
    _full_name,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'avatar_url',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Lookup the role id
  SELECT id INTO _role_id FROM public.roles WHERE name = _role_name;

  -- If role not found, fallback to 'customer'
  IF _role_id IS NULL THEN
    SELECT id INTO _role_id FROM public.roles WHERE name = 'customer';
  END IF;

  -- Assign the role (skip if already assigned)
  IF _role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, _role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  -- If the role is seller, create seller-related rows
  IF _role_name = 'seller' THEN
    _seller_uuid := gen_random_uuid();
    _seller_id := 'SEL-IND-' || lpad(
      coalesce((SELECT count(*) + 1 FROM public.sellers), 1)::text,
      6, '0'
    );

    _username := lower(regexp_replace(_full_name, '[^a-zA-Z0-9]', '', 'g'))
                 || '_' || floor(random() * 1000)::text;
    WHILE EXISTS (SELECT 1 FROM public.sellers WHERE username = _username) LOOP
      _username := lower(regexp_replace(_full_name, '[^a-zA-Z0-9]', '', 'g'))
                   || '_' || floor(random() * 1000)::text;
    END LOOP;

    _seller_type := COALESCE(NEW.raw_user_meta_data ->> 'seller_type', 'shop_owner');

    INSERT INTO public.sellers (
      id, user_id, seller_id, seller_type, legal_name, display_name, username,
      village, district, state, description, kyc_status, current_tier
    ) VALUES (
      _seller_uuid, NEW.id, _seller_id, _seller_type,
      _full_name, _full_name, _username,
      NEW.raw_user_meta_data ->> 'city',
      NEW.raw_user_meta_data ->> 'city',
      NEW.raw_user_meta_data ->> 'state',
      NEW.raw_user_meta_data ->> 'shop_description',
      'pending', 'bronze'
    );

    INSERT INTO public.shops (id, seller_id, shop_name, shop_slug, shop_story, business_location)
    VALUES (
      gen_random_uuid(), _seller_uuid,
      COALESCE(NEW.raw_user_meta_data ->> 'shop_name', _full_name || ' Shop'),
      lower(regexp_replace(
        COALESCE(NEW.raw_user_meta_data ->> 'shop_name', _full_name || ' Shop'),
        '[^a-zA-Z0-9]', '-', 'g'
      )) || '-' || floor(random() * 1000)::text,
      NEW.raw_user_meta_data ->> 'shop_description',
      NEW.raw_user_meta_data ->> 'city'
    );

    INSERT INTO public.bank_accounts (
      id, seller_id, account_holder_name, account_number, ifsc_code, bank_name
    ) VALUES (
      gen_random_uuid(), _seller_uuid,
      COALESCE(NEW.raw_user_meta_data ->> 'account_name', _full_name),
      COALESCE(NEW.raw_user_meta_data ->> 'account_number', '000000000000'),
      COALESCE(NEW.raw_user_meta_data ->> 'ifsc', 'XXXX0000000'),
      COALESCE(NEW.raw_user_meta_data ->> 'bank_name', 'Unknown Bank')
    );

    INSERT INTO public.seller_performance (
      id, seller_id, total_sales, avg_rating, return_rate,
      cancellation_rate, on_time_dispatch_rate, performance_score
    ) VALUES (gen_random_uuid(), _seller_uuid, 0, 0, 0, 0, 0, 0);

    IF NEW.raw_user_meta_data ->> 'aadhar' IS NOT NULL THEN
      INSERT INTO public.seller_documents (id, seller_id, document_type, document_number, verified)
      VALUES (gen_random_uuid(), _seller_uuid, 'aadhaar', NEW.raw_user_meta_data ->> 'aadhar', false);
    END IF;

    IF NEW.raw_user_meta_data ->> 'pan' IS NOT NULL
       AND NEW.raw_user_meta_data ->> 'pan' <> ''
    THEN
      INSERT INTO public.seller_documents (id, seller_id, document_type, document_number, verified)
      VALUES (gen_random_uuid(), _seller_uuid, 'pan', NEW.raw_user_meta_data ->> 'pan', false);
    END IF;
  END IF;

  RETURN NEW;
END;
$handle_new_user$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Auto-provisions profile + role on new auth.users INSERT. '
  'SECURITY: role is whitelist-restricted to customer/seller/delivery_partner. '
  'admin/super_admin must be granted out-of-band by a SUPER_ADMIN via sa_admins. '
  'Hardened in Task 5 migration 20260906165000.';


-- =============================================================================
-- SECTION B: MARK SYSTEM ROLES (idempotent UPDATE)
-- =============================================================================

UPDATE public.roles
SET is_system_role = true
WHERE name IN ('admin', 'super_admin')
  AND is_system_role = false;


-- =============================================================================
-- SECTION C: NEW ENUMs (all idempotent)
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE public.sa_admin_role AS ENUM (
    'SUPER_ADMIN', 'SENIOR_ADMIN', 'FINANCE_ADMIN', 'OPERATIONS_ADMIN',
    'SUPPORT_ADMIN', 'CONTENT_ADMIN', 'DELIVERY_ADMIN', 'CUSTOM_ADMIN'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.admin_status AS ENUM (
    'active', 'inactive', 'suspended', 'pending'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.panel_access_level AS ENUM (
    'none', 'view', 'edit', 'full'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.panel_access_source AS ENUM (
    'default', 'granted', 'blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.panel_request_status AS ENUM (
    'pending', 'approved', 'rejected', 'withdrawn'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.kyc_doc_status AS ENUM (
    'pending', 'under_review', 'approved', 'rejected', 'requires_resubmission'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- =============================================================================
-- SECTION D: sa_admins - Admin Identity Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sa_admins (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL UNIQUE
                          REFERENCES auth.users(id) ON DELETE RESTRICT,
  email                 text NOT NULL UNIQUE,
  full_name             text NOT NULL,
  avatar_url            text,
  role                  public.sa_admin_role NOT NULL,
  status                public.admin_status  NOT NULL DEFAULT 'pending',
  department            text,
  notes                 text,
  totp_secret_encrypted text,
  totp_enabled          boolean NOT NULL DEFAULT false,
  totp_verified_at      timestamptz,
  last_login_at         timestamptz,
  created_by            uuid REFERENCES public.sa_admins(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.sa_admins IS
  'Super-admin portal identity. Extends auth.users for SA-specific fields. '
  'Role whitelist enforced: only granted by existing SUPER_ADMIN out-of-band.';
COMMENT ON COLUMN public.sa_admins.totp_secret_encrypted IS
  'AES-256-GCM encrypted TOTP secret. Uses ENCRYPTION_KEY server env var. '
  'NULL = not enrolled. Decryption only in src/config/env.server.ts context.';
COMMENT ON COLUMN public.sa_admins.totp_enabled IS
  'True only after admin verifies their first OTP code (Task 11).';

CREATE INDEX IF NOT EXISTS sa_admins_email_idx   ON public.sa_admins (email);
CREATE INDEX IF NOT EXISTS sa_admins_user_id_idx ON public.sa_admins (user_id);
CREATE INDEX IF NOT EXISTS sa_admins_role_idx    ON public.sa_admins (role);
CREATE INDEX IF NOT EXISTS sa_admins_status_idx  ON public.sa_admins (status);


-- =============================================================================
-- SECTION E: sa_panel_access_grants
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sa_panel_access_grants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   uuid NOT NULL REFERENCES public.sa_admins(id) ON DELETE CASCADE,
  panel      text NOT NULL CHECK (panel IN (
               'dashboard', 'analytics',
               'finance', 'finance.commissions', 'finance.settlements',
               'kyc-verification', 'products', 'reviews',
               'sellers', 'customers', 'orders', 'returns',
               'delivery', 'coupons', 'offers',
               'panel-requests', 'settings', 'storefront',
               'audit-logs', 'notifications', 'support', 'admin-control'
             )),
  level      public.panel_access_level  NOT NULL,
  source     public.panel_access_source NOT NULL DEFAULT 'granted',
  granted_by uuid REFERENCES public.sa_admins(id) ON DELETE SET NULL,
  note       text,
  granted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (admin_id, panel)
);

COMMENT ON TABLE public.sa_panel_access_grants IS
  'Panel-level access grants for SA portal users. '
  'Upsert on (admin_id, panel) to change access level.';

CREATE INDEX IF NOT EXISTS sapag_admin_id_idx ON public.sa_panel_access_grants (admin_id);
CREATE INDEX IF NOT EXISTS sapag_panel_idx    ON public.sa_panel_access_grants (panel);


-- =============================================================================
-- SECTION F: sa_panel_access_requests
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sa_panel_access_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        uuid NOT NULL REFERENCES public.sa_admins(id) ON DELETE CASCADE,
  requested_panel text NOT NULL CHECK (requested_panel IN (
                    'dashboard', 'analytics',
                    'finance', 'finance.commissions', 'finance.settlements',
                    'kyc-verification', 'products', 'reviews',
                    'sellers', 'customers', 'orders', 'returns',
                    'delivery', 'coupons', 'offers',
                    'panel-requests', 'settings', 'storefront',
                    'audit-logs', 'notifications', 'support', 'admin-control'
                  )),
  requested_level public.panel_access_level  NOT NULL,
  reason          text NOT NULL,
  status          public.panel_request_status NOT NULL DEFAULT 'pending',
  requested_at    timestamptz NOT NULL DEFAULT now(),
  reviewed_by     uuid REFERENCES public.sa_admins(id) ON DELETE SET NULL,
  reviewed_at     timestamptz,
  review_note     text,
  CONSTRAINT no_duplicate_pending
    EXCLUDE USING btree (admin_id WITH =, requested_panel WITH =)
    WHERE (status = 'pending')
);

COMMENT ON TABLE public.sa_panel_access_requests IS
  'Inbox for SA panel access requests. '
  'EXCLUDE prevents duplicate pending requests for same (admin, panel).';

CREATE INDEX IF NOT EXISTS sapar_admin_id_idx ON public.sa_panel_access_requests (admin_id);
CREATE INDEX IF NOT EXISTS sapar_status_idx   ON public.sa_panel_access_requests (status);


-- =============================================================================
-- SECTION G: sa_trusted_devices
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.sa_trusted_devices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid NOT NULL REFERENCES public.sa_admins(id) ON DELETE CASCADE,
  device_id    text NOT NULL,
  device_name  text,
  ip_address   text,
  user_agent   text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (admin_id, device_id)
);

COMMENT ON TABLE  public.sa_trusted_devices IS
  'Trusted devices for SA portal stage-3 login. Expires after 30 days.';
COMMENT ON COLUMN public.sa_trusted_devices.device_id IS
  'Client-generated fingerprint stored in httpOnly cookie by SA auth flow (Task 11).';

CREATE INDEX IF NOT EXISTS satd_admin_id_idx ON public.sa_trusted_devices (admin_id);
CREATE INDEX IF NOT EXISTS satd_expires_idx  ON public.sa_trusted_devices (expires_at);


-- =============================================================================
-- SECTION H: Fix admin_activity_log FK (0 rows - safe)
-- =============================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='admin_activity_log'
      AND constraint_name='admin_activity_log_admin_id_fkey'
  ) THEN
    ALTER TABLE public.admin_activity_log
      ADD CONSTRAINT admin_activity_log_admin_id_fkey
      FOREIGN KEY (admin_id) REFERENCES public.sa_admins(id) ON DELETE SET NULL;
  END IF;
END $$;

COMMENT ON COLUMN public.admin_activity_log.admin_id IS
  'FK -> sa_admins(id). SET NULL on admin deletion preserves log history.';


-- =============================================================================
-- SECTION I: Fix admin_audit_logs actor_id FK (0 rows - safe)
-- =============================================================================

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema='public' AND table_name='admin_audit_logs'
      AND constraint_name='admin_audit_logs_actor_id_fkey'
  ) THEN
    ALTER TABLE public.admin_audit_logs
      ADD CONSTRAINT admin_audit_logs_actor_id_fkey
      FOREIGN KEY (actor_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;
  END IF;
END $$;

COMMENT ON COLUMN public.admin_audit_logs.actor_id IS
  'FK -> profiles(id). SA admin actions use their profile uuid. '
  'ON DELETE RESTRICT: audit rows must be purged before profile deletion.';


-- =============================================================================
-- SECTION J: KYC Admin-Review Columns on seller_documents (13 rows - additive)
-- Task 2 declared these columns; this migration applies them.
-- The original `verified` boolean is NOT dropped.
-- =============================================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='verification_status') THEN
    ALTER TABLE public.seller_documents
      ADD COLUMN verification_status public.kyc_doc_status NOT NULL DEFAULT 'pending';
    COMMENT ON COLUMN public.seller_documents.verification_status IS
      'Admin KYC review status. Task-7 trigger syncs sellers.kyc_status '
      'when all documents for a seller reach approved.';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='reviewed_by') THEN
    ALTER TABLE public.seller_documents
      ADD COLUMN reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;
    COMMENT ON COLUMN public.seller_documents.reviewed_by IS
      'profiles(id) of the SA admin who reviewed this document.';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='reviewed_at') THEN
    ALTER TABLE public.seller_documents ADD COLUMN reviewed_at timestamptz;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='reviewer_notes') THEN
    ALTER TABLE public.seller_documents ADD COLUMN reviewer_notes text;
    COMMENT ON COLUMN public.seller_documents.reviewer_notes IS
      'Rejection reason or approval notes from the reviewing admin.';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='masked_identifier') THEN
    ALTER TABLE public.seller_documents ADD COLUMN masked_identifier text;
    COMMENT ON COLUMN public.seller_documents.masked_identifier IS
      'Masked document_number for UI display (e.g. XXXX-XXXX-1234). '
      'Populated by application layer on insert.';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='seller_documents'
      AND column_name='storage_path') THEN
    ALTER TABLE public.seller_documents ADD COLUMN storage_path text;
    COMMENT ON COLUMN public.seller_documents.storage_path IS
      'Supabase Storage object path for the document file (Task 8). NULL until uploaded.';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS seller_docs_verif_status_idx
  ON public.seller_documents (verification_status);

CREATE INDEX IF NOT EXISTS seller_docs_reviewed_by_idx
  ON public.seller_documents (reviewed_by)
  WHERE reviewed_by IS NOT NULL;


-- =============================================================================
-- SECTION K: RLS - enable on all new tables
-- Policies are Task 6 scope. Until then: deny-all for anon/authenticated;
-- service-role key (server-only) bypasses RLS safely.
-- =============================================================================

ALTER TABLE public.sa_admins                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sa_panel_access_grants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sa_panel_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sa_trusted_devices       ENABLE ROW LEVEL SECURITY;

COMMIT;
