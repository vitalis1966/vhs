import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Polyfill browser globals for SSR/SSG build environment
if (typeof window === 'undefined') {
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
  ;(globalThis as any).window = globalThis
}

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
)
