CREATE POLICY "Authenticated can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO authenticated
USING (true);