import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Landing } from './Landing';

describe('Landing', () => {
  describe('when rendered', () => {
    it('should display the nav brand, hero, a landing section and the footer', () => {
      renderWithIntl(<Landing />);

      expect(screen.getByRole('link', { name: 'Cochería Nogués & Martínez' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1, name: 'Cochería Nogués & Martínez' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Nuestros servicios' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Preguntas frecuentes' })).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
