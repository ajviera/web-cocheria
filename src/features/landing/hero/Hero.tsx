import { useTranslations } from 'next-intl';
import styles from './Hero.module.css';

export const Hero = () => {
  const t = useTranslations('hero');

  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.tagline}>{t('tagline')}</p>
        <p className={styles.body}>{t('body')}</p>
        <div className={styles.actions}>
          <a href="#contacto" className={styles.primary}>
            {t('ctaPrimary')}
          </a>
          <a href="#servicios" className={styles.secondary}>
            {t('ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  );
};
