-- ============================================================
-- Seller Management RLS
--
-- Tables:
-- sellers
-- seller_documents
-- bank_accounts
-- seller_performance
-- shops
--
-- ============================================================

-- ============================================================
-- SELLERS
-- ============================================================

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sellers_select_own"
ON public.sellers
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR public.is_admin()
);

CREATE POLICY "sellers_update_own"
ON public.sellers
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
    OR public.is_admin()
)
WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
);

CREATE POLICY "sellers_insert_own"
ON public.sellers
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

-- ============================================================
-- SELLER DOCUMENTS
-- ============================================================

ALTER TABLE public.seller_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seller_documents_select_own"
ON public.seller_documents
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

CREATE POLICY "seller_documents_insert_own"
ON public.seller_documents
FOR INSERT
TO authenticated
WITH CHECK (
    seller_id = public.current_seller_id()
);

CREATE POLICY "seller_documents_update_own"
ON public.seller_documents
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
-- BANK ACCOUNTS
-- ============================================================

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bank_accounts_select_own"
ON public.bank_accounts
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

CREATE POLICY "bank_accounts_insert_own"
ON public.bank_accounts
FOR INSERT
TO authenticated
WITH CHECK (
    seller_id = public.current_seller_id()
);

CREATE POLICY "bank_accounts_update_own"
ON public.bank_accounts
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
-- SELLER PERFORMANCE
-- ============================================================

ALTER TABLE public.seller_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "seller_performance_select_own"
ON public.seller_performance
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
    OR public.is_admin()
);

-- ============================================================
-- SHOPS
-- ============================================================

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shops_select_public"
ON public.shops
FOR SELECT
USING (true);

CREATE POLICY "shops_insert_own"
ON public.shops
FOR INSERT
TO authenticated
WITH CHECK (
    seller_id = public.current_seller_id()
);

CREATE POLICY "shops_update_own"
ON public.shops
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