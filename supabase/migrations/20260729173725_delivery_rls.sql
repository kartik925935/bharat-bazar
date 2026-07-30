-- ============================================================
-- DELIVERY PARTNERS
-- ============================================================

ALTER TABLE public.delivery_partners
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_partners_select_own"
ON public.delivery_partners
FOR SELECT
TO authenticated
USING (
    id = public.current_delivery_partner_id()
    OR public.is_admin()
);

CREATE POLICY "delivery_partners_update_own"
ON public.delivery_partners
FOR UPDATE
TO authenticated
USING (
    id = public.current_delivery_partner_id()
    OR public.is_admin()
)
WITH CHECK (
    id = public.current_delivery_partner_id()
    OR public.is_admin()
);

-- ============================================================
-- DELIVERIES
-- ============================================================

ALTER TABLE public.deliveries
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deliveries_select_customer"
ON public.deliveries
FOR SELECT
TO authenticated
USING (
    public.owns_delivery(id)
);

CREATE POLICY "deliveries_select_partner"
ON public.deliveries
FOR SELECT
TO authenticated
USING (
    delivery_partner_id = public.current_delivery_partner_id()
);

CREATE POLICY "deliveries_select_admin"
ON public.deliveries
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

ALTER TABLE public.delivery_status_history
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_status_history_select_customer"
ON public.delivery_status_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.deliveries d
        WHERE d.id = delivery_status_history.delivery_id
        AND public.owns_delivery(d.id)
    )
);

CREATE POLICY "delivery_status_history_select_partner"
ON public.delivery_status_history
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.deliveries d
        WHERE d.id = delivery_status_history.delivery_id
        AND d.delivery_partner_id = public.current_delivery_partner_id()
    )
);

CREATE POLICY "delivery_status_history_select_admin"
ON public.delivery_status_history
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

CREATE POLICY "delivery_status_history_insert_partner"
ON public.delivery_status_history
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.deliveries d
        WHERE d.id = delivery_status_history.delivery_id
        AND d.delivery_partner_id = public.current_delivery_partner_id()
    )
);

