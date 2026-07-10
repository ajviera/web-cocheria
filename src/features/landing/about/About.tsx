import { useTranslations } from 'next-intl';
import styles from './About.module.css';

const HIGHLIGHTS = ['salas', 'equipo', 'integral', 'tramites'] as const;

export const About = () => {
  const t = useTranslations('about');

  return (
    <section id="nosotros" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.body}>{t('body1')}</p>
          <p className={styles.body}>{t('body2')}</p>
        </div>

        <ul className={styles.highlights}>
          {HIGHLIGHTS.map(key => (
            <li key={key} className={styles.highlight}>
              <span className={styles.mark} aria-hidden="true" />
              {t(`highlights.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
