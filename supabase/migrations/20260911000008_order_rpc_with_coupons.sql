-- Update create_order_from_cart to handle applied coupons

CREATE OR REPLACE FUNCTION public.create_order_from_cart(p_user_id uuid, p_shipping_address_id uuid)
RETURNS uuid AS $$
DECLARE
    v_order_id uuid;
    v_address jsonb;
    v_cart_id uuid;
    v_applied_coupon_id uuid;
    v_subtotal numeric(10,2) := 0;
    v_discount_amount numeric(10,2) := 0;
    v_order_number text;
    v_coupon RECORD;
    v_eligible_subtotal numeric(10,2) := 0;
    ci RECORD;
BEGIN
    -- 1. Get the cart and any applied coupon
    SELECT id, applied_coupon_id INTO v_cart_id, v_applied_coupon_id 
    FROM public.carts 
    WHERE user_id = p_user_id;
    
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'Cart not found';
    END IF;

    -- 2. Get the address
    SELECT to_jsonb(a) INTO v_address FROM public.addresses a WHERE id = p_shipping_address_id AND user_id = p_user_id;
    IF v_address IS NULL THEN
        RAISE EXCEPTION 'Shipping address not found';
    END IF;

    -- 3. Calculate base subtotal
    SELECT COALESCE(SUM(cit.quantity * p.selling_price), 0) INTO v_subtotal
    FROM public.cart_items cit
    JOIN public.products p ON p.id = cit.product_id
    WHERE cit.cart_id = v_cart_id;

    IF v_subtotal = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    -- 4. Process Coupon if exists
    IF v_applied_coupon_id IS NOT NULL THEN
        SELECT * INTO v_coupon FROM public.coupons WHERE id = v_applied_coupon_id AND is_active = true AND valid_until >= now();
        
        IF FOUND THEN
            -- Calculate eligible subtotal for this coupon
            IF v_coupon.coupon_type = 'admin' THEN
                v_eligible_subtotal := v_subtotal;
            ELSE
                SELECT COALESCE(SUM(cit.quantity * p.selling_price), 0) INTO v_eligible_subtotal
                FROM public.cart_items cit
                JOIN public.products p ON p.id = cit.product_id
                WHERE cit.cart_id = v_cart_id AND p.seller_id = v_coupon.seller_id;
            END IF;

            IF v_eligible_subtotal >= v_coupon.min_order_value THEN
                -- Calculate discount
                IF v_coupon.discount_type = 'percentage' THEN
                    v_discount_amount := (v_eligible_subtotal * v_coupon.discount_value / 100.0);
                ELSE
                    v_discount_amount := v_coupon.discount_value;
                    -- Ensure we don't discount more than the eligible subtotal
                    IF v_discount_amount > v_eligible_subtotal THEN
                        v_discount_amount := v_eligible_subtotal;
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- 5. Generate order number
    v_order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 1000000)::text, 6, '0');

    -- 6. Create Order
    INSERT INTO public.orders (
        order_number, user_id, status, shipping_address, subtotal, delivery_charge, discount_amount, total_amount
    )
    VALUES (
        v_order_number, p_user_id, 'confirmed', v_address, v_subtotal, 0, v_discount_amount, (v_subtotal - v_discount_amount)
    )
    RETURNING id INTO v_order_id;

    -- 7. Record coupon usage if applied
    IF v_discount_amount > 0 THEN
        INSERT INTO public.coupon_usages (coupon_id, user_id, order_id)
        VALUES (v_applied_coupon_id, p_user_id, v_order_id);
    END IF;

    -- 8. Insert order items & decrement inventory
    FOR ci IN (
        SELECT cit.product_id, cit.variant_id, cit.quantity, p.selling_price, p.name, p.seller_id
        FROM public.cart_items cit
        JOIN public.products p ON p.id = cit.product_id
        WHERE cit.cart_id = v_cart_id
    ) LOOP
        -- Decrement inventory (OR-002)
        UPDATE public.inventory
        SET quantity_available = quantity_available - ci.quantity
        WHERE product_id = ci.product_id AND quantity_available >= ci.quantity;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Not enough inventory for product %', ci.name;
        END IF;

        -- Insert order item
        INSERT INTO public.order_items (
            order_id, product_id, seller_id, variant_id, product_name, quantity, unit_price, subtotal, item_status
        )
        VALUES (
            v_order_id, ci.product_id, ci.seller_id, ci.variant_id, ci.name, ci.quantity, ci.selling_price, ci.quantity * ci.selling_price, 'pending'
        );
    END LOOP;

    -- 9. Clear cart
    DELETE FROM public.cart_items WHERE cart_id = v_cart_id;
    UPDATE public.carts SET applied_coupon_id = NULL WHERE id = v_cart_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
