-- REV Rules: Seller Deletion Block & Auto-Update Rating

-- 1. RLS Policy to prevent sellers from deleting reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON public.reviews
FOR SELECT USING (is_approved = true);

-- Allow super admin and admin full access
CREATE POLICY "Admins have full access to reviews" ON public.reviews
FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() 
        AND r.name IN ('admin', 'super_admin')
    )
);

-- Allow users to read their own reviews (even pending)
CREATE POLICY "Users can read own reviews" ON public.reviews
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Allow users to create reviews
CREATE POLICY "Users can insert own reviews" ON public.reviews
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() AND is_approved = false);

-- Allow users to update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Allow users to delete their own reviews
CREATE POLICY "Users can delete own reviews" ON public.reviews
FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Allow sellers to read reviews on their products (but no delete)
CREATE POLICY "Sellers can read reviews on their products" ON public.reviews
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        JOIN public.sellers s ON p.seller_id = s.id
        WHERE p.id = reviews.product_id
        AND s.user_id = auth.uid()
    )
);

-- 2. Auto-Update Seller Rating Trigger
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_seller_id uuid;
    v_avg_rating numeric(3,2);
BEGIN
    -- Find the seller for this product
    SELECT seller_id INTO v_seller_id
    FROM public.products
    WHERE id = NEW.product_id;

    -- Calculate new average rating for this seller based on approved reviews
    SELECT COALESCE(AVG(rating), 0) INTO v_avg_rating
    FROM public.reviews r
    JOIN public.products p ON r.product_id = p.id
    WHERE p.seller_id = v_seller_id
      AND r.is_approved = true;

    -- Update seller performance
    UPDATE public.seller_performance
    SET rating = v_avg_rating
    WHERE seller_id = v_seller_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_seller_rating ON public.reviews;
CREATE TRIGGER trigger_update_seller_rating
  AFTER UPDATE OF is_approved ON public.reviews
  FOR EACH ROW
  WHEN (NEW.is_approved = true AND OLD.is_approved = false)
  EXECUTE FUNCTION public.update_seller_rating();
