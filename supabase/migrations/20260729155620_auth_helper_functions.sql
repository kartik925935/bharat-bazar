-- ============================================================
-- AUTHORIZATION HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_role(role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r
            ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name = role_name
    );
$$;


CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role('admin')
        OR public.has_role('super_admin');
$$;

CREATE OR REPLACE FUNCTION public.is_seller()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role('seller');
$$;

CREATE OR REPLACE FUNCTION public.is_delivery_partner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role('delivery_partner');
$$;