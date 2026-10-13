-- 1. Remove anon-wide access to raw reviews (exposes user_id/order_id)
DROP POLICY IF EXISTS "Public can view review content" ON public.reviews;

-- Serve public reviews through the identity-free view instead
ALTER VIEW public.public_reviews SET (security_invoker = off);
GRANT SELECT ON public.public_reviews TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.public_reviews FROM anon, authenticated;

-- 2. Newsletter signups: replace always-true insert policy with validated insert
DROP POLICY IF EXISTS "Anyone can sign up for newsletter" ON public.newsletter_signups;

CREATE POLICY "Anyone can sign up for newsletter with a valid email"
ON public.newsletter_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 6 AND 254
  AND email ~ '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Ensure emails stay unreadable from the client
REVOKE SELECT, UPDATE, DELETE ON public.newsletter_signups FROM anon, authenticated;
GRANT INSERT ON public.newsletter_signups TO anon, authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;