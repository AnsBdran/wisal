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
        enabled: true,
        suppressWarnings: false,
        navigateFallback: '/',
        navigateFallbackAllowlist: [/^\/$/],
        type: 'module',
      },
      manifest: {
        name: 'وصال',
        short_name: 'وصال',
        description: 'تواصل وتراسل مع أصدقائك',
        theme_color: '#ffffff',
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
    // RemixVitePWAPlugin({

    //   strategies: 'injectManifest',
    //   mode: 'development',
    //   base: '/feed',
    //   registerType: 'autoUpdate',
    //   workbox: {
    //     globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,ico,svg,png}'],
    //   },
    //   manifest: {
    //     name: 'وصال',
    //     short_name: 'وصال',
    //     description: 'تواصل وتراسل مع أصدقائك',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/icons/manifest-icon-192.maskable.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'any',
    //       },
    //       {
    //         src: '/icons/manifest-icon-192.maskable.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'maskable',
    //       },
    //       {
    //         src: '/icons/manifest-icon-512.maskable.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any',
    //       },
    //       {
    //         src: '/icons/manifest-icon-512.maskable.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'maskable',
    //       },
    //     ],
    //   },
    //   pwaAssets: {
    //     config: true,
    //   },
    //   devOptions: {
    //     enabled: true,
    //     suppressWarnings: true,
    //     type: 'module',
    //   },
    // }),
  ],
});
