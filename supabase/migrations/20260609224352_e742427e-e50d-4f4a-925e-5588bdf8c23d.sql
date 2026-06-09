-- Add explicit SELECT policy for administrators table to make admin-only read access intent explicit
CREATE POLICY "Admins can view administrators"
ON public.administrators
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));