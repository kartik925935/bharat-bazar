CREATE OR REPLACE FUNCTION public.owns_delivery(delivery_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.deliveries d
    JOIN public.orders o
      ON d.order_id = o.id
    WHERE d.id = delivery_uuid
      AND o.user_id = auth.uid()
);
$$;


CREATE OR REPLACE FUNCTION public.current_delivery_partner_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT dp.id
FROM public.delivery_partners dp
WHERE dp.user_id = auth.uid()
LIMIT 1;
$$;

