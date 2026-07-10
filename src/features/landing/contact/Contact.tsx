import { useTranslations } from 'next-intl';
import { SITE, telHref, whatsappHref } from '@/config/site';
import styles from './Contact.module.css';

export const Contact = () => {
  const t = useTranslations('contact');

  return (
    <section id="contacto" className={styles.contact}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        <p className={styles.availability}>{t('availability')}</p>

        <dl className={styles.details}>
          <div className={styles.detail}>
            <dt className={styles.label}>{t('phoneLabel')}</dt>
            <dd>
              <a href={telHref(SITE.tel)} className={styles.value}>
                {SITE.phone}
              </a>
            </dd>
          </div>
          <div className={styles.detail}>
            <dt className={styles.label}>{t('addressLabel')}</dt>
            <dd>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(SITE.address)}`}
                className={styles.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.address}
              </a>
            </dd>
          </div>
        </dl>

        <a
          href={whatsappHref(SITE.whatsapp)}
          className={styles.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('whatsappCta')}
        </a>
      </div>
    </section>
  );
};
