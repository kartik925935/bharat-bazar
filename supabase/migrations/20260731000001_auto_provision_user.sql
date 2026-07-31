-- ===========================================================
-- AUTO-PROVISION PROFILE & ROLE FOR NEW AUTH USERS
-- ===========================================================
-- This trigger fires when a new user is created in auth.users
-- (via email signup, Google OAuth, etc.) and automatically
-- creates a profile row and assigns the 'customer' role.

-- 1. Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role_name text;
  _role_id   int;
  _full_name text;
  _seller_uuid uuid;
  _seller_id text;
  _username text;
  _seller_type text;
BEGIN
  -- Determine the role from user metadata, default to 'customer'
  _role_name := COALESCE(
    NEW.raw_user_meta_data ->> 'role',
    'customer'
  );

  -- Build full name from metadata
  _full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    CONCAT_WS(' ',
      NEW.raw_user_meta_data ->> 'first_name',
      NEW.raw_user_meta_data ->> 'last_name'
    ),
    -- Google OAuth puts the name here:
    NEW.raw_user_meta_data ->> 'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Insert profile (skip if already exists)
  INSERT INTO public.profiles (id, full_name, phone, avatar_url, status)
  VALUES (
    NEW.id,
    _full_name,
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'avatar_url',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Lookup the role id
  SELECT id INTO _role_id
  FROM public.roles
  WHERE name = _role_name;

  -- If role not found, fallback to 'customer'
  IF _role_id IS NULL THEN
    SELECT id INTO _role_id
    FROM public.roles
    WHERE name = 'customer';
  END IF;

  -- Assign the role (skip if already assigned)
  IF _role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, _role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;

  -- If the role is seller, create the seller-related tables
  IF _role_name = 'seller' THEN
    _seller_uuid := gen_random_uuid();
    -- Generate sequential seller ID: SEL-IND-000123
    _seller_id := 'SEL-IND-' || lpad(coalesce((select count(*) + 1 from public.sellers), 1)::text, 6, '0');
    
    -- Generate unique username
    _username := lower(regexp_replace(_full_name, '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 1000)::text;
    WHILE EXISTS (SELECT 1 FROM public.sellers WHERE username = _username) LOOP
      _username := lower(regexp_replace(_full_name, '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 1000)::text;
    END LOOP;

    _seller_type := COALESCE(NEW.raw_user_meta_data ->> 'seller_type', 'shop_owner');

    INSERT INTO public.sellers (
      id, user_id, seller_id, seller_type, legal_name, display_name, username,
      village, district, state, description, kyc_status, current_tier
    ) VALUES (
      _seller_uuid,
      NEW.id,
      _seller_id,
      _seller_type,
      _full_name,
      _full_name,
      _username,
      NEW.raw_user_meta_data ->> 'city',
      NEW.raw_user_meta_data ->> 'city',
      NEW.raw_user_meta_data ->> 'state',
      NEW.raw_user_meta_data ->> 'shop_description',
      'pending',
      'bronze'
    );

    -- Create Shop
    INSERT INTO public.shops (
      id, seller_id, shop_name, shop_slug, shop_story, business_location
    ) VALUES (
      gen_random_uuid(),
      _seller_uuid,
      COALESCE(NEW.raw_user_meta_data ->> 'shop_name', _full_name || ' Shop'),
      lower(regexp_replace(COALESCE(NEW.raw_user_meta_data ->> 'shop_name', _full_name || ' Shop'), '[^a-zA-Z0-9]', '-', 'g')) || '-' || floor(random() * 1000)::text,
      NEW.raw_user_meta_data ->> 'shop_description',
      NEW.raw_user_meta_data ->> 'city'
    );

    -- Create Bank Account
    INSERT INTO public.bank_accounts (
      id, seller_id, account_holder_name, account_number, ifsc_code, bank_name
    ) VALUES (
      gen_random_uuid(),
      _seller_uuid,
      COALESCE(NEW.raw_user_meta_data ->> 'account_name', _full_name),
      COALESCE(NEW.raw_user_meta_data ->> 'account_number', '000000000000'),
      COALESCE(NEW.raw_user_meta_data ->> 'ifsc', 'XXXX0000000'),
      COALESCE(NEW.raw_user_meta_data ->> 'bank_name', 'Unknown Bank')
    );

    -- Create Seller Performance
    INSERT INTO public.seller_performance (
      id, seller_id, total_sales, avg_rating, return_rate, cancellation_rate, on_time_dispatch_rate, performance_score
    ) VALUES (
      gen_random_uuid(),
      _seller_uuid,
      0, 0, 0, 0, 0, 0
    );

    -- Create Seller Documents
    IF NEW.raw_user_meta_data ->> 'aadhar' IS NOT NULL THEN
      INSERT INTO public.seller_documents (
        id, seller_id, document_type, document_number, verified
      ) VALUES (
        gen_random_uuid(),
        _seller_uuid,
        'aadhaar',
        NEW.raw_user_meta_data ->> 'aadhar',
        false
      );
    END IF;

    IF NEW.raw_user_meta_data ->> 'pan' IS NOT NULL AND NEW.raw_user_meta_data ->> 'pan' <> '' THEN
      INSERT INTO public.seller_documents (
        id, seller_id, document_type, document_number, verified
      ) VALUES (
        gen_random_uuid(),
        _seller_uuid,
        'pan',
        NEW.raw_user_meta_data ->> 'pan',
        false
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Trigger (drop if exists first, then recreate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
