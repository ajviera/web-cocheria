import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { track } from '@vercel/analytics';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Hero } from './Hero';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Hero', () => {
  describe('when rendered', () => {
    it('should display the heading and taglines', () => {
      renderWithIntl(<Hero />);

      expect(screen.getByRole('heading', { level: 1, name: 'Cocheria Nogues & Martinez' })).toBeInTheDocument();
      expect(screen.getByText('Servicios fúnebres')).toBeInTheDocument();
      expect(
        screen.getByText('Acompañamos cada despedida con respeto, calidez y compromiso.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Acompañamos a cada familia en los momentos más difíciles. Como cocheria en José C. Paz, disponemos de modernas salas velatorias y un equipo humano preparado para brindar un servicio integral, con contención y asesoramiento las 24 horas, los 365 días del año.',
        ),
      ).toBeInTheDocument();
    });

    it('should render WhatsApp and call action links pointing to the configured channels', () => {
      renderWithIntl(<Hero />);

      const whatsapp = screen.getByRole('link', { name: /Escribir por WhatsApp/ });
      const call = screen.getByRole('link', { name: 'Llamar ahora' });

      expect(whatsapp).toHaveAttribute('href', 'https://wa.me/5491161512447');
      expect(whatsapp).toHaveAttribute('target', '_blank');
      expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
      expect(call).toHaveAttribute('href', 'tel:+5491161512447');
    });

    it('should display the configured address', () => {
      renderWithIntl(<Hero />);

      expect(
        screen.getByText('Av. Gaspar Campos 4848, José C. Paz, Buenos Aires'),
      ).toBeInTheDocument();
    });

    it('should render the full-bleed storefront photo with descriptive alt text', () => {
      renderWithIntl(<Hero />);

      const photo = screen.getByRole('img', {
        name: /Fachada de Cocheria Nogues & Martinez/,
      });
      expect(photo).toHaveAttribute('src', expect.stringContaining('fachada'));
    });
  });

  describe('when the user takes a contact action', () => {
    it('should report the WhatsApp click from the hero', async () => {
      const user = userEvent.setup();
      renderWithIntl(<Hero />);

      await user.click(screen.getByRole('link', { name: /Escribir por WhatsApp/ }));

      expect(track).toHaveBeenCalledWith('whatsapp_click', { location: 'hero' });
    });

    it('should report the call click from the hero', async () => {
      const user = userEvent.setup();
      renderWithIntl(<Hero />);

      await user.click(screen.getByRole('link', { name: 'Llamar ahora' }));

      expect(track).toHaveBeenCalledWith('tel_click', { location: 'hero' });
    });
  });
});
