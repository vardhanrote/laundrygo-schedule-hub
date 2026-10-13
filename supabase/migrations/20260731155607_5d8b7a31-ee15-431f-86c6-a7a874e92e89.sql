DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews
WITH (security_invoker = on)
AS
SELECT id, rating, comment, created_at
FROM public.reviews;

CREATE POLICY "Public can view review content"
ON public.reviews
FOR SELECT
TO anon
USING (true);

REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, rating, comment, created_at) ON public.reviews TO anon;
GRANT SELECT ON public.public_reviews TO anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;