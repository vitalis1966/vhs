import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Polyfill browser globals for SSR/SSG build environment
if (typeof window === 'undefined' || typeof document === 'undefined') {
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
  const noopEl = () => ({
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

  if (typeof globalThis.localStorage === 'undefined') {
    ;(globalThis as any).localStorage = noopStorage
  }
  if (typeof globalThis.sessionStorage === 'undefined') {
    ;(globalThis as any).sessionStorage = noopStorage
  }
  if (typeof globalThis.document === 'undefined') {
    const rootEl = noopEl()
    rootEl.id = 'root'
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
  }
  if (typeof globalThis.window === 'undefined') {
    ;(globalThis as any).window = globalThis
    ;(globalThis as any).window.location = location
    ;(globalThis as any).window.navigator = { userAgent: '' }
    ;(globalThis as any).window.addEventListener = noop
    ;(globalThis as any).window.removeEventListener = noop
    ;(globalThis as any).window.requestAnimationFrame = (cb: Function) => setTimeout(cb, 0)
    ;(globalThis as any).window.cancelAnimationFrame = noop
    ;(globalThis as any).window.matchMedia = () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop })
    ;(globalThis as any).window.getComputedStyle = () => ({})
    ;(globalThis as any).window.scrollTo = noop
    ;(globalThis as any).window.innerWidth = 1280
    ;(globalThis as any).window.innerHeight = 800
  }
  if (!(globalThis as any).window.location) {
    ;(globalThis as any).window.location = location
  }
  if (typeof globalThis.navigator === 'undefined') {
    ;(globalThis as any).navigator = { userAgent: '' }
  }
  if (typeof globalThis.HTMLElement === 'undefined') {
    ;(globalThis as any).HTMLElement = class HTMLElement {}
  }
  if (typeof globalThis.IntersectionObserver === 'undefined') {
    ;(globalThis as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  if (typeof globalThis.ResizeObserver === 'undefined') {
    ;(globalThis as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  if (typeof globalThis.MutationObserver === 'undefined') {
    ;(globalThis as any).MutationObserver = class {
      observe() {}
      disconnect() {}
      takeRecords() { return [] }
    }
  }
}

export const createRoot = ViteReactSSG(
  { routes, basename: import.meta.env.BASE_URL },
)
