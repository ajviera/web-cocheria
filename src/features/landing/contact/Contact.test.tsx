import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Contact } from './Contact';

const ADDRESS = 'Av. Gaspar Campos 4848, José C. Paz, Buenos Aires';
const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

describe('Contact', () => {
  describe('when rendered', () => {
    it('should render the phone card linked to the tel href', () => {
      renderWithIntl(<Contact />);

      const phoneLink = screen.getByRole('link', { name: /Teléfono/ });

      expect(phoneLink).toHaveAttribute('href', 'tel:+5491161512447');
    });

    it('should render the address and directions links pointing to Google Maps', () => {
      renderWithIntl(<Contact />);

      const addressLink = screen.getByRole('link', { name: new RegExp(ADDRESS) });
      const directionsLink = screen.getByRole('link', { name: 'Cómo llegar →' });

      expect(addressLink).toHaveAttribute('href', MAPS);
      expect(addressLink).toHaveAttribute('target', '_blank');
      expect(addressLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(directionsLink).toHaveAttribute('href', MAPS);
    });

    it('should render a WhatsApp link pointing to wa.me with no mailto link present', () => {
      renderWithIntl(<Contact />);

      const whatsappLink = screen.getByRole('link', { name: 'Escribir por WhatsApp' });

      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5491161512447');
      expect(whatsappLink).toHaveAttribute('target', '_blank');
      expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');

      expect(document.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    });

    it('should render an embedded Google Maps iframe pointing to the site address', () => {
      renderWithIntl(<Contact />);

      const mapIframe = screen.getByTitle(
        'Mapa de ubicación de Cocheria Nogues & Martinez en José C. Paz',
      );

      expect(mapIframe).toBeInTheDocument();
      expect(mapIframe).toHaveAttribute(
        'src',
        `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`,
      );
    });
  });
});
