// Per-tab platform context.
// Stored in sessionStorage so VHS and Vitalis OS can be open in separate tabs
// without leaking authentication context across platforms.

export type Platform = "vhs" | "vitalis_os";

const KEY = "vhs.platformContext";

export function getPlatform(): Platform | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === "vhs" || v === "vitalis_os" ? v : null;
  } catch {
    return null;
  }
}

export function setPlatform(p: Platform): void {
  try { sessionStorage.setItem(KEY, p); } catch { /* ignore */ }
}

export function clearPlatform(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function loginPathFor(p: Platform): string {
  return p === "vhs" ? "/admin/login" : "/employee-login";
}
