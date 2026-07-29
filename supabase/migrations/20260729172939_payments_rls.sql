ALTER TABLE public.payments
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_customer"
ON public.payments
FOR SELECT
TO authenticated
USING (
    public.owns_order(order_id)
);

CREATE POLICY "payments_select_admin"
ON public.payments
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);


