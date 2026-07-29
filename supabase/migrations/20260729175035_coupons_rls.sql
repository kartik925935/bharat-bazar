-- ============================================================
-- COUPONS
-- ============================================================

ALTER TABLE public.coupons
ENABLE ROW LEVEL SECURITY;

-- Public can view only active and currently valid coupons
CREATE POLICY "coupons_select_public"
ON public.coupons
FOR SELECT
USING (
    is_active = true
    AND valid_from <= now()
    AND valid_until >= now()
);

-- Seller/Admin can view their own coupons
CREATE POLICY "coupons_select_own"
ON public.coupons
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

-- Seller can create their own coupons
CREATE POLICY "coupons_insert_own"
ON public.coupons
FOR INSERT
TO authenticated
WITH CHECK (
    seller_id = public.current_seller_id()
);

-- Seller/Admin can update their own coupons
CREATE POLICY "coupons_update_own"
ON public.coupons
FOR UPDATE
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
)
WITH CHECK (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

-- ============================================================
-- COUPON USAGES
-- ============================================================

ALTER TABLE public.coupon_usages
ENABLE ROW LEVEL SECURITY;

-- User can view their own coupon usage history
CREATE POLICY "coupon_usages_select_own"
ON public.coupon_usages
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

-- Backend/User can insert usage for their own account
CREATE POLICY "coupon_usages_insert_own"
ON public.coupon_usages
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

-- Admin can view all coupon usage
CREATE POLICY "coupon_usages_select_admin"
ON public.coupon_usages
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

-- ============================================================
-- OFFERS
-- ============================================================

ALTER TABLE public.offers
ENABLE ROW LEVEL SECURITY;

-- Public can view only active and currently valid offers
CREATE POLICY "offers_select_public"
ON public.offers
FOR SELECT
USING (
    is_active = true
    AND valid_from <= now()
    AND valid_until >= now()
);

-- Admin creates offers
CREATE POLICY "offers_insert_admin"
ON public.offers
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin()
);

-- Admin updates offers
CREATE POLICY "offers_update_admin"
ON public.offers
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);

-- ============================================================
-- COMMISSIONS
-- ============================================================

ALTER TABLE public.commissions
ENABLE ROW LEVEL SECURITY;

-- Seller/Admin can view commissions
CREATE POLICY "commissions_select_own"
ON public.commissions
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

-- ============================================================
-- SETTLEMENTS
-- ============================================================

ALTER TABLE public.settlements
ENABLE ROW LEVEL SECURITY;

-- Seller/Admin can view settlements
CREATE POLICY "settlements_select_own"
ON public.settlements
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================

ALTER TABLE public.audit_logs
ENABLE ROW LEVEL SECURITY;

-- Only administrators can access audit logs
CREATE POLICY "audit_logs_select_admin"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);