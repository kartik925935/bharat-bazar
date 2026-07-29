-- ============================================================
-- ADDRESSES
-- ============================================================

ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses_select_own"
ON public.addresses
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
    OR public.is_admin()
);

CREATE POLICY "addresses_insert_own"
ON public.addresses
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "addresses_update_own"
ON public.addresses
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

CREATE POLICY "addresses_delete_own"
ON public.addresses
FOR DELETE
TO authenticated
USING (
    user_id = auth.uid()
);

-- ============================================================
-- WISHLISTS
-- ============================================================

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlists_select_own"
ON public.wishlists
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

CREATE POLICY "wishlists_insert_own"
ON public.wishlists
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "wishlists_delete_own"
ON public.wishlists
FOR DELETE
TO authenticated
USING (
    user_id = auth.uid()
);


-- ============================================================
-- CARTS
-- ============================================================

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "carts_select_own"
ON public.carts
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

CREATE POLICY "carts_insert_own"
ON public.carts
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "carts_update_own"
ON public.carts
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
)
WITH CHECK (
    user_id = auth.uid()
);

