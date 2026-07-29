-- ============================================================
-- PRODUCT HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.owns_product(product_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
SELECT EXISTS (
    SELECT 1
    FROM public.products p
    WHERE p.id = product_uuid
      AND p.seller_id = public.current_seller_id()
);
$$;