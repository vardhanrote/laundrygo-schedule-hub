-- 1. Fix mutable search_path on functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.loyalty_points (user_id, points)
  VALUES (NEW.id, 0);

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Newsletter signups: no readable access at all
REVOKE SELECT, UPDATE, DELETE ON public.newsletter_signups FROM anon, authenticated;
GRANT INSERT ON public.newsletter_signups TO anon, authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;

-- 3. Reviews: remove public read of user identities
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

CREATE POLICY "Users can view own reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE VIEW public.public_reviews
WITH (security_invoker = off)
AS
SELECT id, rating, comment, created_at
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon, authenticated;