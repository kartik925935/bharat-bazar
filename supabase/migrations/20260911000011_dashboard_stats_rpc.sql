-- ============================================================
-- SUPER ADMIN DASHBOARD STATS RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_gmv numeric(14,2) := 0;
  v_active_sellers bigint := 0;
  v_pending_kyc bigint := 0;
  v_active_orders bigint := 0;
BEGIN
  -- 1. Total GMV (gross merchandise value of non-cancelled orders)
  SELECT COALESCE(SUM(total_amount), 0)
  INTO v_total_gmv
  FROM public.orders
  WHERE status NOT IN ('cancelled', 'failed');

  -- 2. Active verified sellers
  SELECT COUNT(*)
  INTO v_active_sellers
  FROM public.sellers
  WHERE status = 'active';

  -- 3. Pending / under review KYC applications
  SELECT COUNT(*)
  INTO v_pending_kyc
  FROM public.sellers
  WHERE kyc_status IN ('pending', 'under_review');

  -- 4. Active in-progress orders
  SELECT COUNT(*)
  INTO v_active_orders
  FROM public.orders
  WHERE status IN ('pending', 'processing', 'confirmed', 'shipped');

  RETURN jsonb_build_object(
    'totalGmv', v_total_gmv,
    'activeSellers', v_active_sellers,
    'pendingKyc', v_pending_kyc,
    'activeOrders', v_active_orders
  );
END;
$$;
