import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@remix-run/node';

export const loader = () => {
  return json(
    {
      short_name: 'wisal',
      name: 'Wisal',
      start_url: '/feed',
      display: 'standalone',
      background_color: '#d3d7dd',
      theme_color: '#c34138',
    } as WebAppManifest,
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
