CREATE OR REPLACE FUNCTION public.owns_order(order_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    WHERE o.id = order_uuid
      AND o.user_id = auth.uid()
);
$$;