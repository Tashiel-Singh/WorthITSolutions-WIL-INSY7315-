import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia for responsive UI testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock container dimensions for Recharts zero-warning execution in JSDOM
window.HTMLElement.prototype.getBoundingClientRect = function() {
  return { width: 800, height: 400, top: 0, left: 0, bottom: 400, right: 800, x: 0, y: 0, toJSON: () => {} };
};

Object.defineProperties(window.HTMLElement.prototype, {
  clientWidth: { get: () => 800, configurable: true },
  clientHeight: { get: () => 400, configurable: true },
  offsetWidth: { get: () => 800, configurable: true },
  offsetHeight: { get: () => 400, configurable: true },
});

// Polyfill ResizeObserver for Recharts responsive container
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill window.scrollTo
window.scrollTo = () => {};

// Global fetch mock for Render backend probing in tests
global.fetch = (window as any).fetch = vi.fn().mockImplementation((url: string) => {
  if (url.includes('/health')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ status: 'ok' })),
      json: () => Promise.resolve({ status: 'ok' }),
    });
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify({})),
    json: () => Promise.resolve({}),
  });
});

