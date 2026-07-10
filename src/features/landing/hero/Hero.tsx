import { useTranslations } from 'next-intl';
import { SITE, telHref, whatsappHref } from '@/config/site';
import styles from './Hero.module.css';

export const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
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
            <a
              href={whatsappHref(SITE.whatsapp)}
              className={styles.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.dotSolid} aria-hidden="true" />
              {t('ctaWhatsapp')}
            </a>
            <a href={telHref(SITE.tel)} className={styles.call}>
              {t('ctaCall')}
            </a>
          </div>

          <p className={styles.address}>
            <span className={styles.rule} aria-hidden="true" />
            {SITE.address}
          </p>
        </div>

        <div className={styles.figure} aria-hidden="true">
          <div className={styles.frame}>
            <span className={styles.frameIcon}>
              <span className={styles.frameIconInner} />
            </span>
            <span className={styles.frameLabel}>
              foto — sala velatoria
              <br />o fachada
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
