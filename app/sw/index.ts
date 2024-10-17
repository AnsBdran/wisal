import {
  cleanupOutdatedCaches,
  clientsClaimMode,
  enablePrecaching,
  navigateFallback,
  promptForUpdate,
  staticRoutes,
  dynamicRoutes,
  routes,
  ssr,
} from 'virtual:vite-pwa/remix/sw';
import { setupPwa } from '@vite-pwa/remix/sw';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  CacheOnly,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';

// Give TypeScript the correct global.
declare const self: ServiceWorkerGlobalScope;

setupPwa({
  manifest: self.__WB_MANIFEST,
});

self.addEventListener('message', (ev) => {
  if (ev.data && ev.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

const staticRoutes = ['about', 'settings', 'profile', 'suggestions'];

const matchers = {
  feed: ({ url }) => url.pathname === '/feed',
  messenger: ({ url }) => url.pathname === '/messenger',
  style: ({ request }) => request.destination === 'style',
  chat: ({ url }) => url.pathname.startsWith('/messenger/'),
  image: ({ request }) => (request.destination = 'image'),
  static: ({ url }) => staticRoutes.some((r) => r === `/${url.pathname}`),
};

registerRoute(matchers.feed, new StaleWhileRevalidate());
registerRoute(matchers.messenger, new StaleWhileRevalidate());
registerRoute(matchers.chat, new NetworkFirst());
registerRoute(
  matchers.image,
  new CacheFirst({
    cacheName: 'image-cache',
  })
);
registerRoute(matchers.style, new CacheFirst());
registerRoute(matchers.static, new CacheFirst());
