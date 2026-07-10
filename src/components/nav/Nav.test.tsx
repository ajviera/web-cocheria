import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Nav } from './Nav';

const renderNav = () =>
  renderWithIntl(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  );

describe('Nav', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render the brand link pointing to the #inicio anchor', () => {
    renderNav();

    expect(
      screen.getByRole('link', { name: 'Cochería Nogués & Martínez' }),
    ).toHaveAttribute('href', '#inicio');
  });

  it('should render the section anchor links', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Servicios' })).toHaveAttribute(
      'href',
      '#servicios',
    );
    expect(screen.getByRole('link', { name: 'Nosotros' })).toHaveAttribute(
      'href',
      '#nosotros',
    );
    expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute(
      'href',
      '#contacto',
    );
  });

  it('should render the CTA link pointing to the #contacto anchor', () => {
    renderNav();

    expect(screen.getByRole('link', { name: 'Atención 24 hs' })).toHaveAttribute(
      'href',
      '#contacto',
    );
  });

  it('should render the theme toggle control', () => {
    renderNav();

    expect(
      screen.getByRole('button', { name: 'Cambiar a modo oscuro' }),
    ).toBeInTheDocument();
  });
});
