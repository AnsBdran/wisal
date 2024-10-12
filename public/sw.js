import {
  cleanupOutdatedCaches,
  clientsClaimMode,
  enablePrecaching,
  navigateFallback,
  promptForUpdate,
  staticRoutes,
  routes,
  ssr,
} from 'virtual:vite-pwa/remix/sw';

clientsClaimMode();
enablePrecaching(self.__WB_MANIFEST);
