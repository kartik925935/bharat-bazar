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
  INSERT INTO public.profiles (id, full_name, avatar_url, status)
  VALUES (
    NEW.id,
    _full_name,
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

  RETURN NEW;
END;
$$;

-- 2. Trigger (drop if exists first, then recreate)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
