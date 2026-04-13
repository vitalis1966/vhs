import { useEffect } from "react";
import { u as usePageSEOFallback } from "./PageSEOContext-DZ23I7UH.js";
function usePageMeta(title, description, ogImage) {
  const { setFallback } = usePageSEOFallback();
  useEffect(() => {
    setFallback({ title, description, ogImage });
  }, [title, description, ogImage, setFallback]);
}
export {
  usePageMeta as u
};
