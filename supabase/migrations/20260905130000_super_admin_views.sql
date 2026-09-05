-- Migration for Super Admin Views and RPCs

-- 1. Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor_id UUID NOT NULL,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    action_code TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    target_entity_type TEXT,
    target_entity_id TEXT,
    target_entity_label TEXT,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON admin_audit_logs(timestamp DESC);

-- 2. Dashboard Stats RPC
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    total_gmv NUMERIC;
    active_sellers INT;
    pending_kyc INT;
    active_orders INT;
    result JSONB;
BEGIN
    -- Total GMV from paid/completed orders (assuming total_amount exists)
    SELECT COALESCE(SUM(total_amount), 0) INTO total_gmv FROM orders WHERE status NOT IN ('cancelled', 'refunded');
    
    -- Active Sellers
    SELECT COUNT(*) INTO active_sellers FROM sellers WHERE status = 'active';
    
    -- Pending KYC
    SELECT COUNT(*) INTO pending_kyc FROM sellers WHERE kyc_status = 'pending' OR kyc_status = 'under_review';
    
    -- Active Orders
    SELECT COUNT(*) INTO active_orders FROM orders WHERE status NOT IN ('delivered', 'cancelled', 'refunded');

    result := jsonb_build_object(
        'totalGmv', total_gmv,
        'activeSellers', active_sellers,
        'pendingKyc', pending_kyc,
        'activeOrders', active_orders
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Sales Analytics RPC
CREATE OR REPLACE FUNCTION get_sales_analytics(days_back INT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_agg(
        jsonb_build_object(
            'date', date_series,
            'revenue', COALESCE(sales.revenue, 0),
            'orders', COALESCE(sales.orders, 0)
        )
    ) INTO result
    FROM (
        SELECT generate_series(CURRENT_DATE - days_back, CURRENT_DATE, '1 day'::interval)::date AS date_series
    ) d
    LEFT JOIN (
        SELECT 
            DATE(created_at) as sale_date, 
            SUM(total_amount) as revenue, 
            COUNT(*) as orders 
        FROM orders 
        WHERE created_at >= (CURRENT_DATE - days_back)
        AND status NOT IN ('cancelled', 'refunded')
        GROUP BY DATE(created_at)
    ) sales ON d.date_series = sales.sale_date;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;
