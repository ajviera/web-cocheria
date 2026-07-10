import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
];

export default sitemap;
