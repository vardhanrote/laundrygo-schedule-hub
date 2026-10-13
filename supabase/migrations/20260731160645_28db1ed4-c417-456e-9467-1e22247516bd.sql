-- Revert to invoker view to avoid security definer view
ALTER VIEW public.public_reviews SET (security_invoker = on);

-- Anon may read reviews rows, but only non-identifying columns
REVOKE ALL ON public.reviews FROM anon;
GRANT SELECT (id, rating, comment, created_at) ON public.reviews TO anon;

CREATE POLICY "Public can view anonymised review content"
ON public.reviews
FOR SELECT
TO anon
USING (true);