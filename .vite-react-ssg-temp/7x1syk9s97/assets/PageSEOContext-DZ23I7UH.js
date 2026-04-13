import { jsx } from "react/jsx-runtime";
import { useState, useCallback, createContext, useContext } from "react";
const PageSEOContext = createContext({
  fallback: { title: "", description: "" },
  setFallback: () => {
  }
});
function PageSEOProvider({ children }) {
  const [fallback, setFallbackState] = useState({ title: "", description: "" });
  const setFallback = useCallback((f) => {
    setFallbackState(
      (prev) => prev.title === f.title && prev.description === f.description && prev.ogImage === f.ogImage ? prev : f
    );
  }, []);
  return /* @__PURE__ */ jsx(PageSEOContext.Provider, { value: { fallback, setFallback }, children });
}
function usePageSEOFallback() {
  return useContext(PageSEOContext);
}
export {
  PageSEOProvider as P,
  usePageSEOFallback as u
};
