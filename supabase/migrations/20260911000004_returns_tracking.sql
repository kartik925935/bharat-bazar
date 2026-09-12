-- RR-001: Add delivered_at to accurately track 7-day return window

ALTER TABLE public.order_items
ADD COLUMN delivered_at timestamptz;

-- Create a function and trigger to auto-set delivered_at when item_status becomes 'delivered'
CREATE OR REPLACE FUNCTION public.set_order_item_delivered_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.item_status = 'delivered' AND OLD.item_status IS DISTINCT FROM 'delivered' THEN
    NEW.delivered_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_order_item_delivered_at ON public.order_items;
CREATE TRIGGER trigger_set_order_item_delivered_at
  BEFORE UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_item_delivered_at();
