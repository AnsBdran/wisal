import {
  defineConfig,
  createAppleSplashScreens,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createAppleSplashScreens(
      {
        padding: 0.3,
        resizeOptions: { fit: 'contain', background: 'white' },
        darkResizeOptions: { fit: 'contain', background: 'black' },
        linkMediaOptions: {
          log: true,
          addMediaScreen: true,
          basePath: '/feed',
          xhtml: true,
        },
      },
      ['iPad Air 9.7"']
    ),
  },
  images: process.env.PNG ? 'public/logo.png' : 'public/favicon.svg',
});
