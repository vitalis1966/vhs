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

  const location = {
    origin: 'https://www.vitalisstrategies.com',
    href: 'https://www.vitalisstrategies.com/',
    hostname: 'www.vitalisstrategies.com',
    pathname: '/',
    search: '',
    hash: '',
    protocol: 'https:',
    host: 'www.vitalisstrategies.com',
    port: '',
    assign() {},
    reload() {},
    replace() {},
    toString() { return this.href },
  }

  const noop = () => {}
  const noopEl = (): any => ({
    style: {},
    setAttribute: noop,
    appendChild: noop,
    removeChild: noop,
    insertBefore: noop,
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    firstChild: null,
    parentNode: null,
    parentElement: null,
    innerHTML: '',
    id: '',
  })

  const rootEl = noopEl()
  rootEl.id = 'root'

  ;(globalThis as any).localStorage = noopStorage
  ;(globalThis as any).sessionStorage = noopStorage

  ;(globalThis as any).document = {
    querySelector: (sel: string) => sel === '#root' ? rootEl : null,
    querySelectorAll: () => [],
    createElement: () => noopEl(),
    createTextNode: () => ({}),
    createDocumentFragment: () => noopEl(),
    head: noopEl(),
    body: { ...noopEl(), firstChild: null },
    getElementById: (id: string) => id === 'root' ? rootEl : null,
    getElementsByTagName: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    documentElement: { style: {}, setAttribute: noop },
  }

  // Use Object.defineProperty for read-only properties on globalThis
  const trySet = (obj: any, key: string, value: any) => {
    try { obj[key] = value } catch {
      try { Object.defineProperty(obj, key, { value, writable: true, configurable: true }) } catch {}
    }
  }

  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = globalThis
  }

  trySet(globalThis.window, 'location', location)
  trySet(globalThis, 'location', location)
  trySet(globalThis.window, 'navigator', { userAgent: '' })
  trySet(globalThis.window, 'addEventListener', noop)
  trySet(globalThis.window, 'removeEventListener', noop)
  trySet(globalThis.window, 'requestAnimationFrame', (cb: Function) => setTimeout(cb, 0))
  trySet(globalThis.window, 'cancelAnimationFrame', noop)
  trySet(globalThis.window, 'matchMedia', () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop }))
  trySet(globalThis.window, 'getComputedStyle', () => ({}))
  trySet(globalThis.window, 'scrollTo', noop)
  trySet(globalThis.window, 'innerWidth', 1280)
  trySet(globalThis.window, 'innerHeight', 800)
  trySet(globalThis.window, 'history', {
    length: 0,
    scrollRestoration: 'auto',
    state: null,
    back: noop,
    forward: noop,
    go: noop,
    pushState: noop,
    replaceState: noop,
  })
  trySet(globalThis.window, 'dispatchEvent', () => true)
  trySet(globalThis.window, 'CustomEvent', class CustomEvent { constructor() {} })

  if (typeof globalThis.HTMLElement === 'undefined') {
    ;(globalThis as any).HTMLElement = class HTMLElement {}
  }
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    ;(globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }
  }
  if (typeof globalThis.ResizeObserver === 'undefined') {
    ;(globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
  }
  if (typeof globalThis.MutationObserver === 'undefined') {
    ;(globalThis as any).MutationObserver = class { observe() {} disconnect() {} takeRecords() { return [] } }
  }
}

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
)
