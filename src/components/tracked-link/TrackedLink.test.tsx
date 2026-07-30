import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { track } from '@vercel/analytics';
import { TrackedLink } from './TrackedLink';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TrackedLink', () => {
  describe('when the user clicks it', () => {
    it('should report the event with its properties', async () => {
      const user = userEvent.setup();
      render(
        <TrackedLink
          href="https://wa.me/5491161512447"
          event="whatsapp_click"
          eventProperties={{ location: 'hero' }}
        >
          Escribir por WhatsApp
        </TrackedLink>,
      );

      await user.click(screen.getByRole('link', { name: 'Escribir por WhatsApp' }));

      expect(track).toHaveBeenCalledWith('whatsapp_click', { location: 'hero' });
      expect(track).toHaveBeenCalledTimes(1);
    });

    it('should report the event without properties when none are given', async () => {
      const user = userEvent.setup();
      render(
        <TrackedLink href="tel:+5491161512447" event="tel_click">
          Llamar ahora
        </TrackedLink>,
      );

      await user.click(screen.getByRole('link', { name: 'Llamar ahora' }));

      expect(track).toHaveBeenCalledWith('tel_click', undefined);
    });
  });

  describe('when rendered', () => {
    it('should forward the remaining anchor attributes to the link', () => {
      render(
        <TrackedLink
          href="https://wa.me/5491161512447"
          event="whatsapp_click"
          target="_blank"
          rel="noopener noreferrer"
          className="cta"
          aria-label="Escribir por WhatsApp"
        >
          WhatsApp
        </TrackedLink>,
      );

      const link = screen.getByRole('link', { name: 'Escribir por WhatsApp' });

      expect(link).toHaveAttribute('href', 'https://wa.me/5491161512447');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveClass('cta');
    });
  });
});
