import { useEffect } from "react";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    
    let meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", description);
    } else {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", description);
      document.head.appendChild(meta);
    }
  }, [title, description]);
}
