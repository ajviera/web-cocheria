'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import type { NavLink } from '@/types';
import styles from './Nav.module.css';

const LINKS: readonly NavLink[] = [
  { id: 'servicios', href: '#servicios', labelKey: 'servicios' },
  { id: 'nosotros', href: '#nosotros', labelKey: 'nosotros' },
];

// Theme-aware brand logo (horizontal line lockup): deep navy on the light
// surface, white on the dark one.
const LOGO_NAVY = '/logos/logo-line-navy.png';
const LOGO_WHITE = '/logos/logo-line-white.png';
const LOGO_WIDTH = 1319;
const LOGO_HEIGHT = 200;

export const Nav = () => {
  const t = useTranslations('nav');
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? LOGO_WHITE : LOGO_NAVY;

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <a href="#inicio" className={styles.brand}>
          <Image
            src={logoSrc}
            alt={t('brand')}
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            className={styles.logo}
            priority
          />
        </a>

        <nav className={styles.links} aria-label={t('brand')}>
          {LINKS.map(link => (
            <a key={link.id} href={link.href} className={styles.link}>
              {t(link.labelKey)}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a href="#contacto" className={styles.cta}>
            {t('cta')}
          </a>
        </div>
      </div>
    </header>
  );
};
