-- ============================================================
-- Add public read access to sellers table
-- 
-- Unauthenticated users (and customers) need to read basic seller info
-- like display_name, seller_type, state, and current_tier to display
-- on the storefront product cards and detail pages.
-- ============================================================

DROP POLICY IF EXISTS "sellers_select_public" ON public.sellers;
CREATE POLICY "sellers_select_public"
ON public.sellers
FOR SELECT
USING (
    true
);
