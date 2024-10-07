import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@remix-run/node';

export const loader = () => {
  return json(
    {
      short_name: 'وصال',
      name: 'وصال',
      start_url: '/feed',
      display: 'standalone',
      background_color: '#d3d7dd',
      theme_color: '#c34138',
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
    } as WebAppManifest,
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
