import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Contact } from './Contact';

describe('Contact', () => {
  describe('when rendered', () => {
    it('should display the phone number linked to the tel href', () => {
      renderWithIntl(<Contact />);

      const phoneLink = screen.getByRole('link', { name: '15-6151-2447' });

      expect(phoneLink).toHaveAttribute('href', 'tel:+5491161512447');
    });

    it('should display the address linked to a Google Maps search', () => {
      renderWithIntl(<Contact />);

      const addressLink = screen.getByRole('link', {
        name: 'Av. Gaspar Campos 4848, José C. Paz, Buenos Aires',
      });

      expect(addressLink).toHaveAttribute(
        'href',
        `https://maps.google.com/?q=${encodeURIComponent('Av. Gaspar Campos 4848, José C. Paz, Buenos Aires')}`,
      );
      expect(addressLink).toHaveAttribute('target', '_blank');
      expect(addressLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should render a WhatsApp link pointing to wa.me with no mailto link present', () => {
      renderWithIntl(<Contact />);

      const whatsappLink = screen.getByRole('link', { name: 'Escribir por WhatsApp' });

      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5491161512447');
      expect(whatsappLink).toHaveAttribute('target', '_blank');
      expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');

      const mailtoLink = screen.queryByRole('link', { name: /mailto/i });
      expect(mailtoLink).not.toBeInTheDocument();
      expect(document.querySelector('a[href^="mailto:"]')).not.toBeInTheDocument();
    });
  });
});
