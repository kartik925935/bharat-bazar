-- Migration to create the RPC for converting a cart into an order.
-- Handles OR-007 (splitting by seller at order_item level) and OR-002 (inventory decrement).

CREATE OR REPLACE FUNCTION public.create_order_from_cart(p_user_id uuid, p_shipping_address_id uuid)
RETURNS uuid AS $$
DECLARE
    v_order_id uuid;
    v_address jsonb;
    v_cart_id uuid;
    v_subtotal numeric(10,2) := 0;
    v_order_number text;
    ci RECORD;
BEGIN
    -- 1. Get the cart
    SELECT id INTO v_cart_id FROM public.carts WHERE user_id = p_user_id;
    IF v_cart_id IS NULL THEN
        RAISE EXCEPTION 'Cart not found';
    END IF;

    -- 2. Get the address
    SELECT to_jsonb(a) INTO v_address FROM public.addresses a WHERE id = p_shipping_address_id AND user_id = p_user_id;
    IF v_address IS NULL THEN
        RAISE EXCEPTION 'Shipping address not found';
    END IF;

    -- 3. Calculate subtotal
    SELECT COALESCE(SUM(cit.quantity * p.selling_price), 0) INTO v_subtotal
    FROM public.cart_items cit
    JOIN public.products p ON p.id = cit.product_id
    WHERE cit.cart_id = v_cart_id;

    IF v_subtotal = 0 THEN
        RAISE EXCEPTION 'Cart is empty';
    END IF;

    -- 4. Generate order number
    v_order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 1000000)::text, 6, '0');

    -- 5. Create Order (setting to 'confirmed' directly since payment integration is skipped)
    INSERT INTO public.orders (
        order_number, user_id, status, shipping_address, subtotal, delivery_charge, discount_amount, total_amount
    )
    VALUES (
        v_order_number, p_user_id, 'confirmed', v_address, v_subtotal, 0, 0, v_subtotal
    )
    RETURNING id INTO v_order_id;

    -- 6. Insert order items & decrement inventory
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

        -- Insert order item (OR-007 cart splitting handled by storing seller_id per item)
        INSERT INTO public.order_items (
            order_id, product_id, seller_id, variant_id, product_name, quantity, unit_price, subtotal, item_status
        )
        VALUES (
            v_order_id, ci.product_id, ci.seller_id, ci.variant_id, ci.name, ci.quantity, ci.selling_price, ci.quantity * ci.selling_price, 'pending'
        );
    END LOOP;

    -- 7. Clear cart
    DELETE FROM public.cart_items WHERE cart_id = v_cart_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
