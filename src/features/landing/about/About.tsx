import { useTranslations } from 'next-intl';
import { Carousel } from './Carousel';
import styles from './About.module.css';

const HIGHLIGHTS = ['salas', 'equipo', 'integral', 'tramites'] as const;

const FLOWERS = [
  '/flowers/flower-1.jpg',
  '/flowers/flower-2.jpg',
  '/flowers/flower-3.jpg',
  '/flowers/flower-4.jpg',
  '/flowers/flower-5.jpg',
  '/flowers/flower-6.jpg',
  '/flowers/flower-7.jpg',
  '/flowers/flower-8.jpg',
] as const;

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

          <ul className={styles.pills}>
            {HIGHLIGHTS.map(key => (
              <li key={key} className={styles.pill}>
                <span className={styles.mark} aria-hidden="true" />
                {t(`highlights.${key}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.figure}>
          <Carousel
            images={FLOWERS}
            autoPlayMs={3000}
            regionLabel={t('carousel.region')}
            previousLabel={t('carousel.previous')}
            nextLabel={t('carousel.next')}
            goToLabel={position => t('carousel.goTo', { position })}
          />
        </div>
      </div>
    </section>
  );
};
