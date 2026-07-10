import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Services } from './Services';

describe('Services', () => {
  describe('when rendered', () => {
    it('should display the section heading', () => {
      renderWithIntl(<Services />);

      expect(screen.getByRole('heading', { level: 2, name: 'Nuestros servicios' })).toBeInTheDocument();
    });

    it('should render the four expected services', () => {
      renderWithIntl(<Services />);

      expect(screen.getByRole('heading', { level: 3, name: 'Servicios Fúnebres' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Traslados' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Velación en Domicilios' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: 'Arreglos Florales' })).toBeInTheDocument();
    });
  });
});
