import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SITE, telHref, whatsappHref } from '@/config/site';
import { ANALYTICS_EVENTS, ANALYTICS_LOCATIONS } from '@/config/analytics';
import { TrackedLink } from '@/components/tracked-link';
import styles from './Hero.module.css';

// Real storefront photo (José C. Paz), rendered full-bleed behind the copy.
const FACADE_SRC = '/fachada.jpg';

const FROM_HERO = { location: ANALYTICS_LOCATIONS.hero };

export const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section id="inicio" className={styles.hero}>
      <Image
        src={FACADE_SRC}
        alt={t('facadeAlt')}
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.veilSide} aria-hidden="true" />
      <div className={styles.veilBottom} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            {t('eyebrow')}
          </p>
          <h1 className={styles.title}>{t('title')}</h1>
          <p className={styles.tagline}>{t('tagline')}</p>
          <p className={styles.body}>{t('body')}</p>

          <div className={styles.actions}>
            <TrackedLink
              href={whatsappHref(SITE.whatsapp)}
              className={styles.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              event={ANALYTICS_EVENTS.whatsappClick}
              eventProperties={FROM_HERO}
            >
              <span className={styles.dotSolid} aria-hidden="true" />
              {t('ctaWhatsapp')}
            </TrackedLink>
            <TrackedLink
              href={telHref(SITE.tel)}
              className={styles.call}
              event={ANALYTICS_EVENTS.telClick}
              eventProperties={FROM_HERO}
            >
              {t('ctaCall')}
            </TrackedLink>
          </div>

          <p className={styles.address}>
            <span className={styles.rule} aria-hidden="true" />
            {SITE.address}
          </p>
        </div>
      </div>
    </section>
  );
};
