import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PageSEOFallback {
  title: string;
  description: string;
}

interface PageSEOContextValue {
  fallback: PageSEOFallback;
  setFallback: (f: PageSEOFallback) => void;
}

const PageSEOContext = createContext<PageSEOContextValue>({
  fallback: { title: "", description: "" },
  setFallback: () => {},
});

export function PageSEOProvider({ children }: { children: ReactNode }) {
  const [fallback, setFallbackState] = useState<PageSEOFallback>({ title: "", description: "" });

  const setFallback = useCallback((f: PageSEOFallback) => {
    setFallbackState((prev) =>
      prev.title === f.title && prev.description === f.description ? prev : f
    );
  }, []);

  return (
    <PageSEOContext.Provider value={{ fallback, setFallback }}>
      {children}
    </PageSEOContext.Provider>
  );
}

export function usePageSEOFallback() {
  return useContext(PageSEOContext);
}
