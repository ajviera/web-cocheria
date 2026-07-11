import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('should render the brand logo linking to the #inicio anchor', () => {
    renderNav();

    expect(
      screen.getByRole('link', { name: 'Cocheria Nogues & Martinez' }),
    ).toHaveAttribute('href', '#inicio');
  });

  it('should show the navy logo in the default light theme', () => {
    renderNav();

    expect(
      screen.getByRole('img', { name: 'Cocheria Nogues & Martinez' }),
    ).toHaveAttribute('src', expect.stringContaining('logo-line-navy'));
  });

  it('should switch to the white logo when dark theme is active', async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(
      screen.getByRole('button', { name: 'Cambiar a modo oscuro' }),
    );

    expect(
      screen.getByRole('img', { name: 'Cocheria Nogues & Martinez' }),
    ).toHaveAttribute('src', expect.stringContaining('logo-line-white'));
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
  });

  it('should not render a Contacto anchor link in the nav', () => {
    renderNav();

    expect(
      screen.queryByRole('link', { name: 'Contacto' }),
    ).not.toBeInTheDocument();
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
