import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

const robots = (): MetadataRoute.Robots => {
  const isProduction = process.env.VERCEL_ENV === 'production';

  return {
    rules: isProduction
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
