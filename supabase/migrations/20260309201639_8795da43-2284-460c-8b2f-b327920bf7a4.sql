
-- Storage bucket for assessment PDF uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('assessment-uploads', 'assessment-uploads', false);

-- Allow anon to upload to assessment-uploads
CREATE POLICY "anon_upload_assessment_pdfs" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'assessment-uploads');
CREATE POLICY "anon_read_assessment_pdfs" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'assessment-uploads');
