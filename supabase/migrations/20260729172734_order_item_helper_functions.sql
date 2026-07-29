CREATE OR REPLACE FUNCTION public.owns_seller_order(order_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.order_items oi
    WHERE oi.order_id = order_uuid
      AND oi.seller_id = public.current_seller_id()
);
$$;

