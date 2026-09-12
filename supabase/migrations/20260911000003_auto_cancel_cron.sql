-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA extensions;

-- Schedule the job to run every hour at minute 0 to auto-cancel orders older than 24 hours
-- that are still in 'pending_payment' state.
SELECT cron.schedule(
    'auto_cancel_unpaid_orders',
    '0 * * * *',
    $$
    UPDATE public.orders
    SET status = 'cancelled'
    WHERE status = 'pending_payment'
      AND created_at < (NOW() - INTERVAL '24 hours');
    $$
);
