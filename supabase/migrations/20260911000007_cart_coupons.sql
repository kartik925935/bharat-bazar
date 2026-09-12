-- CP Rules: Coupon constraints and carts association

-- 1. CP-001 Case insensitivity for coupon codes
CREATE OR REPLACE FUNCTION public.uppercase_coupon_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.code = UPPER(NEW.code);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_uppercase_coupon_code ON public.coupons;
CREATE TRIGGER trigger_uppercase_coupon_code
    BEFORE INSERT OR UPDATE ON public.coupons
    FOR EACH ROW EXECUTE FUNCTION public.uppercase_coupon_code();

-- 2. Add applied_coupon_id to carts
ALTER TABLE public.carts
ADD COLUMN applied_coupon_id uuid REFERENCES public.coupons(id) ON DELETE SET NULL;
