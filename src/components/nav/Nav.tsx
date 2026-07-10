'use client';

import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme-toggle';
import type { NavLink } from '@/types';
import styles from './Nav.module.css';

const LINKS: readonly NavLink[] = [
  { id: 'servicios', href: '#servicios', labelKey: 'servicios' },
  { id: 'nosotros', href: '#nosotros', labelKey: 'nosotros' },
  { id: 'contacto', href: '#contacto', labelKey: 'contacto' },
];

export const Nav = () => {
  const t = useTranslations('nav');

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.brand}>
          {t('brand')}
        </a>

        <nav className={styles.links} aria-label={t('brand')}>
          {LINKS.map(link => (
            <a key={link.id} href={link.href} className={styles.link}>
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#contacto" className={styles.cta}>
            {t('cta')}
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
