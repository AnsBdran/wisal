/// <reference lib="WebWorker" />
import {
  clearUpOldCaches,
  DefaultFetchHandler,
  EnhancedCache,
  isDocumentRequest,
  isLoaderRequest,
  Logger,
  MessageHandler,
  SkipWaitHandler,
} from '@remix-pwa/sw';
const logger = new Logger({
  prefix: 'anas',
});
export {};

declare let self: ServiceWorkerGlobalScope;

// constants
const version = 'v1';
const DOCUMENT_CACHE_NAME = `document-cache`;
const ASSET_CACHE_NAME = `asset-cache`;
const DATA_CACHE_NAME = `data-cache`;

// cache types
const documentCache = new EnhancedCache(DOCUMENT_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxEntries: 64,
  },
});

const assetCache = new EnhancedCache(ASSET_CACHE_NAME, {
  version,
  strategy: 'CacheFirst',
  strategyOptions: {
    maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
    maxEntries: 100,
  },
});

const dataCache = new EnhancedCache(DATA_CACHE_NAME, {
  version,
  strategy: 'NetworkFirst',
  strategyOptions: {
    networkTimeoutInSeconds: 10,
    maxEntries: 72,
  },
});

export const defaultFetchHandler: DefaultFetchHandler = async ({ context }) => {
  const request = context.event.request;
  const url = new URL(request.url);

  if (isDocumentRequest(request)) {
    return documentCache.handleRequest(request);
  }

  if (isLoaderRequest(request)) {
    return dataCache.handleRequest(request);
  }

  if (self.__workerManifest.assets.includes(url.pathname)) {
    return assetCache.handleRequest(request);
  }
  return fetch(request);
};

self.addEventListener('install', (event) => {
  // logger.log('Service worker installed');

  // event.waitUntil(self.skipWaiting());
  event.waitUntil(
    Promise.all([
      assetCache.preCacheUrls(
        self.__workerManifest.assets.filter(
          (url) => !url.endsWith('.map') && !url.endsWith('.js')
        )
      ),
      self.skipWaiting(),
    ])
  );
});

self.addEventListener('activate', (event) => {
  logger.log('Service worker activated');

  event.waitUntil(
    Promise.all([
      clearUpOldCaches(
        [DOCUMENT_CACHE_NAME, DATA_CACHE_NAME, ASSET_CACHE_NAME],
        version
      ),
      self.clients.claim(),
    ])
  );
});

const skipHandler = new SkipWaitHandler();
const messageHandler = new MessageHandler('message');

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  event.waitUntil(Promise.all([messageHandler.handleMessage(event)])),
    skipHandler.handleMessage(event);
});
