import { useTranslations } from 'next-intl';
import { SITE, telHref } from '@/config/site';
import styles from './Footer.module.css';

export const Footer = () => {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <p className={styles.brand}>{t('brand')}</p>
          <p className={styles.tagline}>{t('tagline')}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.badge}>{t('availability')}</span>
          <a href={telHref(SITE.tel)} className={styles.phone}>
            {SITE.phone}
          </a>
          <span className={styles.phone}>{SITE.address}</span>
        </div>
      </div>

      <div className={styles.legal}>
        © {year} {t('brand')}. {t('rights')}
      </div>
    </footer>
  );
};
