import { supabase } from "@/integrations/supabase/client";

// Signed-URL helpers used by both the VHS Admin portal (admin storage policy)
// and by Vitalis OS workspace members (via the get-assignment-document-url
// edge function, since members do not have direct storage access).

export async function adminCreateSignedUrl(storage_path: string): Promise<string | null> {
  const { data } = await (supabase as any).storage
    .from("client-documents")
    .createSignedUrl(storage_path, 60);
  return data?.signedUrl ?? null;
}

export async function adminDownload(storage_path: string): Promise<Blob | null> {
  const { data } = await (supabase as any).storage.from("client-documents").download(storage_path);
  return data ?? null;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Workspace member path — goes through edge function with service role.
export async function getAssignmentDocumentUrl(
  assignment_id: string,
  opts: { download?: boolean } = {},
): Promise<{ url: string; file_name: string; file_type: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke("get-assignment-document-url", {
    body: { assignment_id, download: !!opts.download },
  });
  if (error) return { error: error.message };
  if ((data as any)?.error) return { error: (data as any).error };
  return data as any;
}

export async function openAssignmentDocument(assignment_id: string) {
  const res = await getAssignmentDocumentUrl(assignment_id, { download: false });
  if ("error" in res) return res;
  window.open(res.url, "_blank", "noopener");
  return res;
}

export async function downloadAssignmentDocument(assignment_id: string) {
  const res = await getAssignmentDocumentUrl(assignment_id, { download: true });
  if ("error" in res) return res;
  // Browser will handle download via content-disposition from signed URL
  const a = document.createElement("a");
  a.href = res.url;
  a.download = res.file_name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return res;
}
