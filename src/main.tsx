import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Polyfill browser globals for SSR/SSG build environment
if (typeof document === 'undefined') {
  const noopStorage: Storage = {
    length: 0,
    clear() {},
    getItem() { return null },
    key() { return null },
    removeItem() {},
    setItem() {},
  }
  ;(globalThis as any).localStorage = noopStorage
  ;(globalThis as any).sessionStorage = noopStorage
  // Minimal document stub for SSR
  ;(globalThis as any).document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }),
    createTextNode: () => ({}),
    head: { appendChild() {}, removeChild() {}, querySelectorAll: () => [] },
    body: { appendChild() {}, removeChild() {}, insertBefore() {}, querySelector: () => null, firstChild: null },
    getElementById: () => null,
    getElementsByTagName: () => [],
    addEventListener() {},
    removeEventListener() {},
    documentElement: { style: {} },
  }
  if (typeof window === 'undefined') {
    ;(globalThis as any).window = globalThis
  }
}

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
)
