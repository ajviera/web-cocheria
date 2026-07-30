import { useTranslations } from 'next-intl';
import { Carousel } from './Carousel';
import styles from './About.module.css';

const HIGHLIGHTS = ['salas', 'equipo', 'integral', 'tramites'] as const;

// Real photos of arrangements we made. Each carries its own alt (see
// `about.carousel.photos.*`): they are product photography, not decoration, so
// an empty alt would throw away the only image-search signal the site has.
const FLOWERS = [
  { src: '/flowers/flower-1.jpg', altKey: 'carousel.photos.photo1' },
  { src: '/flowers/flower-2.jpg', altKey: 'carousel.photos.photo2' },
  { src: '/flowers/flower-3.jpg', altKey: 'carousel.photos.photo3' },
  { src: '/flowers/flower-4.jpg', altKey: 'carousel.photos.photo4' },
  { src: '/flowers/flower-5.jpg', altKey: 'carousel.photos.photo5' },
  { src: '/flowers/flower-6.jpg', altKey: 'carousel.photos.photo6' },
  { src: '/flowers/flower-7.jpg', altKey: 'carousel.photos.photo7' },
  { src: '/flowers/flower-8.jpg', altKey: 'carousel.photos.photo8' },
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
            images={FLOWERS.map(({ src, altKey }) => ({ src, alt: t(altKey) }))}
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
