import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { envOnlyMacros } from 'vite-env-only';
import { RemixVitePWA } from '@vite-pwa/remix';
import { installGlobals } from '@remix-run/node';

installGlobals();

const { RemixPWAPreset, RemixVitePWAPlugin } = RemixVitePWA();

// for testing purposes only
const usingRemixSW = process.env.PLAIN_SW !== 'true';
// for testing purposes only
const virtualPwaModule = process.env.VIRTUAL_PWA_MODULE !== 'false';

process.env.VITE_VIRTUAL_PWA_MODULE = virtualPwaModule.toString();
process.env.VITE_PUBLIC_VIRTUAL_PWA_MODULE =
  process.env.VITE_VIRTUAL_PWA_MODULE;
process.env.VITE_BUILD_DATE = JSON.stringify(new Date().toISOString());

export default defineConfig({
  define: {
    VITE_VIRTUAL_PWA_MODULE: process.env.VITE_VIRTUAL_PWA_MODULE,
    VITE_PUBLIC_VIRTUAL_PWA_MODULE: process.env.VITE_VIRTUAL_PWA_MODULE,
    VITE_BUILD_DATE: process.env.VITE_BUILD_DATE,
  },

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
      filename: usingRemixSW ? 'index.ts' : 'plain.ts',
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
        enabled: true,
        suppressWarnings: true,
        navigateFallback: '/',
        navigateFallbackAllowlist: [/^\/$/],
        type: 'module',
      },
      injectManifest: {
        globPatterns: ['**/*.{js,html,css,png,svg,ico.jpg,jpeg}'],

        // for testing
        minify: false,
        // for testing
        enableWorkboxModulesLogs: true,
      },
      remix: {
        injectManifest: {
          clientsClaimMode: usingRemixSW
            ? virtualPwaModule
              ? true
              : 'auto'
            : undefined,
        },
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
