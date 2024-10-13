import { setupPwa } from '@vite-pwa/remix/sw';
import { cacheNames, clientsClaim } from 'workbox-core';
import {
  registerRoute,
  setCatchHandler,
  setDefaultHandler,
} from 'workbox-routing';
import type { StrategyHandler } from 'workbox-strategies';
import { NetworkFirst, NetworkOnly, Strategy } from 'workbox-strategies';
import type { ManifestEntry } from 'workbox-build';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

// Give TypeScript the correct global.
// declare const self: ServiceWorkerGlobalScope;
declare const self: ServiceWorkerGlobalScope;
declare type ExtendableEvent = any;

// setupPwa({
//   manifest: self.__WB_MANIFEST,
// });

self.addEventListener('message', (ev) => {
  if (ev.data && ev.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
