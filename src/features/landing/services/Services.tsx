import { useTranslations } from 'next-intl';
import type { ServiceItem } from '@/types';
import styles from './Services.module.css';

const SERVICES: readonly ServiceItem[] = [
  { id: 'funebres', titleKey: 'items.funebres.title', descriptionKey: 'items.funebres.description' },
  { id: 'traslados', titleKey: 'items.traslados.title', descriptionKey: 'items.traslados.description' },
  { id: 'velacion', titleKey: 'items.velacion.title', descriptionKey: 'items.velacion.description' },
  { id: 'florales', titleKey: 'items.florales.title', descriptionKey: 'items.florales.description' },
];

export const Services = () => {
  const t = useTranslations('services');

  return (
    <section id="servicios" className={styles.services}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <ul className={styles.grid}>
        {SERVICES.map((service, index) => (
          <li key={service.id} className={styles.card}>
            <span className={styles.num} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.cardTitle}>{t(service.titleKey)}</h3>
            <p className={styles.cardText}>{t(service.descriptionKey)}</p>
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <a href="#contacto" className={styles.cta}>
          {t('cta')}
        </a>
      </div>
    </section>
  );
};
