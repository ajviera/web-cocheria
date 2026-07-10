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
        {SERVICES.map(service => (
          <li key={service.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{t(service.titleKey)}</h3>
            <p className={styles.cardText}>{t(service.descriptionKey)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};
