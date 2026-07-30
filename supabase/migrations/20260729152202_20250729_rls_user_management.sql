-- =====================================================
-- USER MANAGEMENT RLS
-- Module 1
-- Tables:
-- profiles
-- roles
-- user_roles
-- =====================================================

---------------------------------------------------------
-- Enable RLS
---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

---------------------------------------------------------
-- PROFILES
---------------------------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    id = auth.uid()
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
    id = auth.uid()
)
WITH CHECK (
    id = auth.uid()
);

---------------------------------------------------------
-- ROLES
---------------------------------------------------------

-- Every authenticated user can read roles
CREATE POLICY "Authenticated users can read roles"
ON public.roles
FOR SELECT
TO authenticated
USING (
    true
);

---------------------------------------------------------
-- USER ROLES
---------------------------------------------------------

-- Users can read only their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);