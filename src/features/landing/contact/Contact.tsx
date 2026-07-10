import { useTranslations } from 'next-intl';
import { SITE, mapsHref, telHref, whatsappHref } from '@/config/site';
import styles from './Contact.module.css';

export const Contact = () => {
  const t = useTranslations('contact');

  return (
    <section id="contacto" className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>
          <span className={styles.availability}>{t('availability')}</span>
        </div>

        <div className={styles.channels}>
          <a
            href={whatsappHref(SITE.whatsapp)}
            className={styles.card}
            aria-label={t('whatsappCta')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={`${styles.icon} ${styles.iconWhatsapp}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('whatsappLabel')}</span>
              <span className={styles.cardValue}>{SITE.phone}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>

          <a href={telHref(SITE.tel)} className={styles.card}>
            <span className={`${styles.icon} ${styles.iconPhone}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('phoneLabel')}</span>
              <span className={styles.cardValue}>{SITE.phone}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>

          <a
            href={mapsHref(SITE.address)}
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={`${styles.icon} ${styles.iconAddress}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('addressLabel')}</span>
              <span className={styles.cardValue}>{SITE.address}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>

          <a
            href={mapsHref(SITE.address)}
            className={styles.directions}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('directionsCta')}
          </a>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
          title={t('mapTitle')}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.map}
        />
      </div>
    </section>
  );
};
