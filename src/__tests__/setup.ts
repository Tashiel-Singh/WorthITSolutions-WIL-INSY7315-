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

