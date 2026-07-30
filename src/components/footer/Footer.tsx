import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SITE, telHref } from '@/config/site';
import { ANALYTICS_EVENTS, ANALYTICS_LOCATIONS } from '@/config/analytics';
import { TrackedLink } from '@/components/tracked-link';
import styles from './Footer.module.css';

export const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <Image
            src="/logos/logo-line-white.png"
            alt={t('brand')}
            width={1319}
            height={200}
            className={styles.logo}
          />
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.badge}>{t('availability')}</span>
          <TrackedLink
            href={telHref(SITE.tel)}
            className={styles.phone}
            event={ANALYTICS_EVENTS.telClick}
            eventProperties={{ location: ANALYTICS_LOCATIONS.footer }}
          >
            {SITE.phone}
          </TrackedLink>
          <address className={styles.phone}>{SITE.address}</address>
        </div>
      </div>

      <div className={styles.legal}>
        © {year} {t('brand')}. {t('rights')}
      </div>
    </footer>
  );
};
