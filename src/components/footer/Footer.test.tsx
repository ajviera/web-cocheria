import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Footer } from './Footer';

describe('Footer', () => {
  it('should render the brand name and tagline', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByText('Cochería Nogués & Martínez')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Servicios fúnebres integrales — acompañamiento con respeto y compromiso.',
      ),
    ).toBeInTheDocument();
  });

  it('should render the availability badge', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByText('Atención 24 hs')).toBeInTheDocument();
  });

  it('should render the phone as a tel: link using the configured contact number', () => {
    renderWithIntl(<Footer />);

    expect(screen.getByRole('link', { name: '15-6151-2447' })).toHaveAttribute(
      'href',
      'tel:+5491161512447',
    );
  });

  it('should render the configured address', () => {
    renderWithIntl(<Footer />);

    expect(
      screen.getByText('Av. Gaspar Campos 4848, José C. Paz, Buenos Aires'),
    ).toBeInTheDocument();
  });

  it('should render the current year in the legal notice', () => {
    renderWithIntl(<Footer />);

    const year = new Date().getFullYear();

    expect(
      screen.getByText(
        `© ${year} Cochería Nogués & Martínez. Todos los derechos reservados.`,
      ),
    ).toBeInTheDocument();
  });
});
