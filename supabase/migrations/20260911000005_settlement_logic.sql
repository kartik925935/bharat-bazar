-- SE-001, SE-002, SE-003, SE-004: Settlement Logic

CREATE OR REPLACE FUNCTION public.process_eligible_settlements()
RETURNS void AS $$
DECLARE
    seller_rec RECORD;
    v_total_amount numeric(10,2);
    v_settlement_id uuid;
BEGIN
    -- 1. Populate commissions for newly delivered items (SE-002: 10% platform commission)
    INSERT INTO public.commissions (
        order_item_id, seller_id, order_amount, commission_rate, commission_amount, seller_net_amount, settlement_status
    )
    SELECT 
        oi.id, 
        oi.seller_id, 
        oi.subtotal, 
        10.00, 
        (oi.subtotal * 0.10), 
        (oi.subtotal - (oi.subtotal * 0.10)), 
        'pending'
    FROM public.order_items oi
    WHERE oi.item_status = 'delivered'
      AND NOT EXISTS (SELECT 1 FROM public.commissions c WHERE c.order_item_id = oi.id);

    -- 2. Mark commissions as 'held' if there is an active return or dispute (SE-003)
    UPDATE public.commissions c
    SET settlement_status = 'held'
    FROM public.returns r
    WHERE c.order_item_id = r.order_item_id
      AND c.settlement_status IN ('pending', 'eligible');

    -- 3. Mark commissions as 'eligible' if return window (7 days) has expired (SE-001)
    UPDATE public.commissions c
    SET settlement_status = 'eligible'
    FROM public.order_items oi
    WHERE c.order_item_id = oi.id
      AND c.settlement_status = 'pending'
      AND oi.delivered_at IS NOT NULL
      AND oi.delivered_at < (now() - interval '7 days');

    -- 4. Generate settlements for sellers with eligible total >= 100 (SE-004)
    FOR seller_rec IN (
        SELECT seller_id, SUM(seller_net_amount) as total_eligible
        FROM public.commissions
        WHERE settlement_status = 'eligible'
        GROUP BY seller_id
        HAVING SUM(seller_net_amount) >= 100
    ) LOOP
        -- Insert into settlements table
        INSERT INTO public.settlements (
            seller_id, period_start, period_end, total_amount, status
        )
        VALUES (
            seller_rec.seller_id, 
            CURRENT_DATE - INTERVAL '30 days', -- Simplified period start
            CURRENT_DATE,
            seller_rec.total_eligible,
            'processing'
        )
        RETURNING id INTO v_settlement_id;

        -- Update the included commissions to 'processing'
        UPDATE public.commissions
        SET settlement_status = 'processing'
        WHERE seller_id = seller_rec.seller_id
          AND settlement_status = 'eligible';
          
        -- (Optional) If we had an external payment gateway for payouts, we would trigger it here.
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
