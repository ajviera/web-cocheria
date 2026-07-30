import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { track } from '@vercel/analytics';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Footer } from './Footer';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Footer', () => {
  it('should render the brand logo and tagline', () => {
    renderWithIntl(<Footer />);

    expect(
      screen.getByRole('img', { name: 'Cocheria Nogues & Martinez' }),
    ).toHaveAttribute('src', expect.stringContaining('logo-line-white'));
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

  it('should render the configured address in a semantic address element', () => {
    const { container } = renderWithIntl(<Footer />);

    const address = container.querySelector('address');

    expect(address).toBeInTheDocument();
    expect(address).toHaveTextContent('Av. Gaspar Campos 4848, José C. Paz, Buenos Aires');
  });

  it('should report the phone click from the footer', async () => {
    const user = userEvent.setup();
    renderWithIntl(<Footer />);

    await user.click(screen.getByRole('link', { name: '15-6151-2447' }));

    expect(track).toHaveBeenCalledWith('tel_click', { location: 'footer' });
  });

  it('should render the current year in the legal notice', () => {
    renderWithIntl(<Footer />);

    const year = new Date().getFullYear();

    expect(
      screen.getByText(
        `© ${year} Cocheria Nogues & Martinez. Todos los derechos reservados.`,
      ),
    ).toBeInTheDocument();
  });
});
