-- ============================================================
-- CART ITEMS ROW LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Authenticated users can view items in their own cart, admins can view all
CREATE POLICY "cart_items_select_own"
ON public.cart_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id
      AND (c.user_id = auth.uid() OR public.is_admin())
  )
);

-- 2. INSERT Policy: Authenticated users can insert items into their own cart
CREATE POLICY "cart_items_insert_own"
ON public.cart_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id
      AND c.user_id = auth.uid()
  )
);

-- 3. UPDATE Policy: Authenticated users can update items in their own cart
CREATE POLICY "cart_items_update_own"
ON public.cart_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id
      AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id
      AND c.user_id = auth.uid()
  )
);

-- 4. DELETE Policy: Authenticated users can delete items from their own cart
CREATE POLICY "cart_items_delete_own"
ON public.cart_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.carts c
    WHERE c.id = cart_items.cart_id
      AND (c.user_id = auth.uid() OR public.is_admin())
  )
);
