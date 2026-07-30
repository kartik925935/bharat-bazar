ALTER TABLE public.order_items
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select_customer"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    public.owns_order(order_id)
);

CREATE POLICY "order_items_select_seller"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    seller_id = public.current_seller_id()
);

CREATE POLICY "order_items_select_admin"
ON public.order_items
FOR SELECT
TO authenticated
USING (
    public.is_admin()
);

