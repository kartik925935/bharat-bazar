ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select_own"
ON public.orders
FOR SELECT
TO authenticated
USING (
    public.owns_order(id)
    OR public.is_admin()
);