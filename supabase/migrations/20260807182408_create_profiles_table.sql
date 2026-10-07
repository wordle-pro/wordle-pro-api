-- 1. Create profiles table with formatting constraints
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Username length between 3 and 20 alphanumeric characters or underscores
  CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,20}$')
);

-- 2. Prevent case-insensitive duplicates (e.g., prevents 'Alex' and 'alex')
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower 
  ON public.profiles (LOWER(username));

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Public read access so users can view each other's profiles
CREATE POLICY "Allow public read access to profiles"
  on public.profiles FOR SELECT
  USING (true);

-- Allow users to update their own profile data
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- 5. Grant table permissions to Supabase execution roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;

-- 6. Trigger function to extract username from signup metadata
-- SET search_path = '' ensures full security against schema path attacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
DECLARE
  extracted_username TEXT;
BEGIN
  -- Extract username from options.data sent during auth.signUp()
  extracted_username := NEW.raw_user_meta_data->>'username';

  IF extracted_username IS NULL OR TRIM(extracted_username) = '' THEN
    RAISE EXCEPTION 'Username is required to register.';
  END IF;

  -- Fully qualify public.profiles since search_path is locked down ('')
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, TRIM(extracted_username));

  RETURN NEW;
END;
$$;

-- 7. Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();