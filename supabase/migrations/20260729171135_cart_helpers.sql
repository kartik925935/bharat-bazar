CREATE OR REPLACE FUNCTION public.owns_cart(cart_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.carts c
    WHERE c.id = cart_uuid
      AND c.user_id = auth.uid()
);
$$;