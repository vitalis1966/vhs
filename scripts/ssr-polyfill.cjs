// This script is preloaded via --require before vite-react-ssg runs,
// ensuring browser globals exist before any CJS module evaluates.

const noop = () => {};

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
  assign: noop,
  reload: noop,
  replace: noop,
  toString() { return this.href; },
};

const noopStorage = {
  length: 0,
  clear: noop,
  getItem() { return null; },
  key() { return null; },
  removeItem: noop,
  setItem: noop,
};

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
  children: [],
  childNodes: [],
  tagName: 'DIV',
  nodeType: 1,
  getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  dataset: {},
  cloneNode: function() { return noopEl(); },
  contains: () => false,
  focus: noop,
  blur: noop,
});

const rootEl = noopEl();
rootEl.id = 'root';

if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    querySelector: (sel) => sel === '#root' ? rootEl : null,
    querySelectorAll: () => [],
    createElement: () => noopEl(),
    createTextNode: () => ({ nodeType: 3 }),
    createDocumentFragment: () => noopEl(),
    createComment: () => ({ nodeType: 8 }),
    head: noopEl(),
    body: Object.assign(noopEl(), { firstChild: null }),
    getElementById: (id) => id === 'root' ? rootEl : null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => true,
    documentElement: { style: {}, setAttribute: noop, classList: { add: noop, remove: noop } },
    cookie: '',
    title: '',
    readyState: 'complete',
    defaultView: null,
  };
}

if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = noopStorage;
}
if (typeof globalThis.sessionStorage === 'undefined') {
  globalThis.sessionStorage = noopStorage;
}

if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis;
}

const trySet = (obj, key, value) => {
  try { obj[key] = value; } catch {
    try { Object.defineProperty(obj, key, { value, writable: true, configurable: true }); } catch {}
  }
};

trySet(globalThis.window, 'location', location);
trySet(globalThis, 'location', location);
trySet(globalThis.window, 'history', {
  length: 0,
  scrollRestoration: 'auto',
  state: null,
  back: noop,
  forward: noop,
  go: noop,
  pushState: noop,
  replaceState: noop,
});
trySet(globalThis.window, 'addEventListener', noop);
trySet(globalThis.window, 'removeEventListener', noop);
trySet(globalThis.window, 'dispatchEvent', () => true);
trySet(globalThis.window, 'requestAnimationFrame', (cb) => setTimeout(cb, 0));
trySet(globalThis.window, 'cancelAnimationFrame', noop);
trySet(globalThis.window, 'matchMedia', () => ({ matches: false, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: () => true }));
trySet(globalThis.window, 'getComputedStyle', () => new Proxy({}, { get: () => '' }));
trySet(globalThis.window, 'scrollTo', noop);
trySet(globalThis.window, 'scroll', noop);
trySet(globalThis.window, 'innerWidth', 1280);
trySet(globalThis.window, 'innerHeight', 800);
trySet(globalThis.window, 'CustomEvent', class CustomEvent { constructor() {} });
trySet(globalThis.window, 'document', globalThis.document);

if (globalThis.document.defaultView === null) {
  globalThis.document.defaultView = globalThis.window;
}

if (typeof globalThis.HTMLElement === 'undefined') {
  globalThis.HTMLElement = class HTMLElement {};
}
if (typeof globalThis.Element === 'undefined') {
  globalThis.Element = class Element {};
}
if (typeof globalThis.Node === 'undefined') {
  globalThis.Node = class Node {};
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
}
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}
if (typeof globalThis.MutationObserver === 'undefined') {
  globalThis.MutationObserver = class { observe() {} disconnect() {} takeRecords() { return []; } };
}
if (typeof globalThis.DOMParser === 'undefined') {
  globalThis.DOMParser = class { parseFromString() { return globalThis.document; } };
}
if (typeof globalThis.XMLSerializer === 'undefined') {
  globalThis.XMLSerializer = class { serializeToString() { return ''; } };
}
if (typeof globalThis.Image === 'undefined') {
  globalThis.Image = class Image { constructor() { this.src = ''; } };
}
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}), text: () => Promise.resolve('') });
}
