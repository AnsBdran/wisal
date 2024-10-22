import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { envOnlyMacros } from 'vite-env-only';
import { RemixVitePWA } from '@vite-pwa/remix';
import { installGlobals } from '@remix-run/node';

installGlobals();

const { RemixPWAPreset, RemixVitePWAPlugin } = RemixVitePWA();

export default defineConfig({
  plugins: [
    envOnlyMacros(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      presets: [RemixPWAPreset()],
    }),
    tsconfigPaths(),
    RemixVitePWAPlugin({
      registerType: 'prompt',
      injectRegister: false,
      strategies: 'injectManifest',
      srcDir: 'app/sw',
      filename: 'index.ts',
      base: '/',
      pwaAssets: {
        disabled: false,
        config: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,html,css,png,svg,ico,png,jpeg}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        suppressWarnings: true,
        navigateFallback: '/feed',
        navigateFallbackAllowlist: [/^\/$/],
        type: 'module',
      },
      // injectManifest: {
      //   globPatterns: ['**/*.{js,html,css,png,svg,ico.jpg,jpeg}'],
      //   enableWorkboxModulesLogs: true,
      // },
      // remix: {
      //   injectManifest: {
      //     cleanupOutdatedCaches: true,
      //   },
      // },

      manifest: {
        name: 'وصال',
        short_name: 'وصال',
        description: 'تواصل وتراسل مع أصدقائك',
        theme_color: '#ffffff',
        background_color: '#cccccc',
        shortcuts: [
          {
            name: 'تواصل مع أنس',
            short_name: 'المؤسس',
            description: 'تواصل مع مطور التطبيق',
            url: '/messenger',
            icons: [
              {
                src: 'favicon.png',
                sizes: '192*192',
              },
            ],
          },
        ],
        icons: [
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
