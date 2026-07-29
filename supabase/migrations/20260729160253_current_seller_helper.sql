CREATE OR REPLACE FUNCTION public.current_seller_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT s.id
    FROM public.sellers AS s
    WHERE s.user_id = auth.uid()
      AND auth.uid() IS NOT NULL
    LIMIT 1;
$$;