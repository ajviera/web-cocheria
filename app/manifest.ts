import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

// Keep manually in sync with src/styles/tokens.css (:root).
const THEME_COLOR = '#1f5fbf'; // --accent (light theme)
const BACKGROUND_COLOR = '#f6f9fc'; // --bg (light theme)

const manifest = async (): Promise<MetadataRoute.Manifest> => {
  const t = await getTranslations('nav');
  const name = t('brand');

  return {
    name,
    short_name: name,
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
};

export default manifest;
