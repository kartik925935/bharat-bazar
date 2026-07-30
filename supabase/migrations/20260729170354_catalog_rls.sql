--====== categories =======

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select_public"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "categories_insert_admin"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (
    public.is_admin()
);

CREATE POLICY "categories_update_admin"
ON public.categories
FOR UPDATE
TO authenticated
USING (
    public.is_admin()
)
WITH CHECK (
    public.is_admin()
);

CREATE POLICY "categories_delete_admin"
ON public.categories
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);

-- products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--read
CREATE POLICY "products_select_public"
ON public.products
FOR SELECT
USING (

status = 'published'

OR

seller_id = public.current_seller_id()

OR

public.is_admin()

);

--insert
CREATE POLICY "products_insert_own"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (

seller_id = public.current_seller_id()

);

--update
CREATE POLICY "products_update_own"
ON public.products
FOR UPDATE
TO authenticated
USING (

seller_id = public.current_seller_id()

OR

public.is_admin()

)

WITH CHECK (

seller_id = public.current_seller_id()

OR

public.is_admin()

);



--product images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;


--read
CREATE POLICY "product_images_select"
ON public.product_images
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.products p
        WHERE p.id = product_images.product_id
        AND (
            p.status = 'published'
            OR p.seller_id = public.current_seller_id()
            OR public.is_admin()
        )
    )
);
--insert
CREATE POLICY "product_images_insert_own"
ON public.product_images
FOR INSERT
TO authenticated
WITH CHECK (
    public.owns_product(product_id)
);

-- update
CREATE POLICY "product_images_update_own"
ON public.product_images
FOR UPDATE
TO authenticated
USING (
    public.owns_product(product_id)
    OR public.is_admin()
)
WITH CHECK (
    public.owns_product(product_id)
    OR public.is_admin()
);

-- product variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_variants_select"
ON public.product_variants
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM public.products p
        WHERE p.id = product_variants.product_id
        AND (
            p.status = 'published'
            OR p.seller_id = public.current_seller_id()
            OR public.is_admin()
        )
    )
);

CREATE POLICY "product_variants_insert_own"
ON public.product_variants
FOR INSERT
TO authenticated
WITH CHECK (
    public.owns_product(product_id)
);

CREATE POLICY "product_variants_update_own"
ON public.product_variants
FOR UPDATE
TO authenticated
USING (
    public.owns_product(product_id)
    OR public.is_admin()
)
WITH CHECK (
    public.owns_product(product_id)
    OR public.is_admin()
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;


--inventory
CREATE POLICY "inventory_select_own"
ON public.inventory
FOR SELECT
TO authenticated
USING (
    public.owns_product(product_id)
    OR public.is_admin()
);

CREATE POLICY "inventory_insert_own"
ON public.inventory
FOR INSERT
TO authenticated
WITH CHECK (
    public.owns_product(product_id)
);

CREATE POLICY "inventory_update_own"
ON public.inventory
FOR UPDATE
TO authenticated
USING (
    public.owns_product(product_id)
    OR public.is_admin()
)
WITH CHECK (
    public.owns_product(product_id)
    OR public.is_admin()
);


