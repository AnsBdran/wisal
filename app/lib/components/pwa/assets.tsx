import { pwaAssetsHead } from 'virtual:pwa-assets/head';
import { PWAManifest } from './manifest';

export const PWAAssets = () => {
  return (
    <>
      {pwaAssetsHead.themeColor ? (
        <meta name='theme-color' content={pwaAssetsHead.themeColor.content} />
      ) : null}
      {pwaAssetsHead.links.map(({ href, ...link }) => (
        <link href={href} key={href} {...link} />
      ))}
      <PWAManifest />
    </>
  );
};
