-- ============================================================
-- REVIEWS
-- ============================================================

ALTER TABLE public.reviews
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_public"
ON public.reviews
FOR SELECT
USING (
    is_approved = true
);

CREATE POLICY "reviews_insert_own"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "reviews_update_own"
ON public.reviews
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
)
WITH CHECK (
    user_id = auth.uid()
);

-- ============================================================
-- RETURNS
-- ============================================================

ALTER TABLE public.returns
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "returns_select_own"
ON public.returns
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

CREATE POLICY "returns_insert_own"
ON public.returns
FOR INSERT
TO authenticated
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "returns_update_own"
ON public.returns
FOR UPDATE
TO authenticated
USING (
    user_id = auth.uid()
)
WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY "returns_update_admin"
ON public.returns
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);