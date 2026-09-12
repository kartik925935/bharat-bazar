-- PR-006: Auto-hide products if seller is suspended (or not approved)
-- We replace the existing 'products_select_public' policy to enforce checking the seller's kyc_status.

DROP POLICY IF EXISTS "products_select_public" ON public.products;

CREATE POLICY "products_select_public"
ON public.products
FOR SELECT
USING (
    (
        status = 'published' 
        AND EXISTS (
            SELECT 1 FROM public.sellers s 
            WHERE s.id = products.seller_id AND s.kyc_status = 'approved'
        )
    )
    OR seller_id = public.current_seller_id()
    OR public.is_admin()
);
