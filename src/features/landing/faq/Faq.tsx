import { useTranslations } from 'next-intl';
import styles from './Faq.module.css';

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  { id: 'primerasHoras', questionKey: 'items.primerasHoras.question', answerKey: 'items.primerasHoras.answer' },
  { id: 'urgencia', questionKey: 'items.urgencia.question', answerKey: 'items.urgencia.answer' },
  { id: 'pami', questionKey: 'items.pami.question', answerKey: 'items.pami.answer' },
  { id: 'traslados', questionKey: 'items.traslados.question', answerKey: 'items.traslados.answer' },
  { id: 'cremacionSepelio', questionKey: 'items.cremacionSepelio.question', answerKey: 'items.cremacionSepelio.answer' },
  { id: 'costos', questionKey: 'items.costos.question', answerKey: 'items.costos.answer' },
];

export const Faq = () => {
  const t = useTranslations('faq');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: t(item.questionKey),
      acceptedAnswer: { '@type': 'Answer', text: t(item.answerKey) },
    })),
  };

  return (
    <section id="preguntas-frecuentes" className={styles.faq}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <div className={styles.list}>
        {FAQ_ITEMS.map((item) => (
          <details key={item.id} className={styles.item}>
            <summary className={styles.question}>{t(item.questionKey)}</summary>
            <p className={styles.answer}>{t(item.answerKey)}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </section>
  );
};
