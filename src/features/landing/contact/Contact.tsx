import { useTranslations } from 'next-intl';
import { SITE, mapsHref, telHref, whatsappHref } from '@/config/site';
import { ANALYTICS_EVENTS, ANALYTICS_LOCATIONS } from '@/config/analytics';
import { TrackedLink } from '@/components/tracked-link';
import styles from './Contact.module.css';

const FROM_CONTACT = { location: ANALYTICS_LOCATIONS.contact };

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
          <TrackedLink
            href={whatsappHref(SITE.whatsapp)}
            className={styles.card}
            aria-label={t('whatsappCta')}
            target="_blank"
            rel="noopener noreferrer"
            event={ANALYTICS_EVENTS.whatsappClick}
            eventProperties={FROM_CONTACT}
          >
            <span className={`${styles.icon} ${styles.iconWhatsapp}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('whatsappLabel')}</span>
              <span className={styles.cardValue}>{SITE.phone}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </TrackedLink>

          <TrackedLink
            href={telHref(SITE.tel)}
            className={styles.card}
            event={ANALYTICS_EVENTS.telClick}
            eventProperties={FROM_CONTACT}
          >
            <span className={`${styles.icon} ${styles.iconPhone}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('phoneLabel')}</span>
              <span className={styles.cardValue}>{SITE.phone}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </TrackedLink>

          <TrackedLink
            href={mapsHref(SITE.address)}
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            event={ANALYTICS_EVENTS.directionsClick}
            eventProperties={FROM_CONTACT}
          >
            <span className={`${styles.icon} ${styles.iconAddress}`} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardLabel}>{t('addressLabel')}</span>
              <address className={styles.cardValue}>{SITE.address}</address>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </TrackedLink>

          <TrackedLink
            href={mapsHref(SITE.address)}
            className={styles.directions}
            target="_blank"
            rel="noopener noreferrer"
            event={ANALYTICS_EVENTS.directionsClick}
            eventProperties={FROM_CONTACT}
          >
            {t('directionsCta')}
          </TrackedLink>
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
