import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Hero } from './Hero';

describe('Hero', () => {
  describe('when rendered', () => {
    it('should display the heading and taglines', () => {
      renderWithIntl(<Hero />);

      expect(screen.getByRole('heading', { level: 1, name: 'Cochería Nogués & Martínez' })).toBeInTheDocument();
      expect(screen.getByText('Servicios fúnebres')).toBeInTheDocument();
      expect(
        screen.getByText('Acompañamos cada despedida con respeto, calidez y compromiso.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Acompañamos a cada familia en los momentos más difíciles. Disponemos de modernas salas velatorias y un equipo humano preparado para brindar un servicio integral, ofreciendo contención y asesoramiento durante todo el proceso.',
        ),
      ).toBeInTheDocument();
    });

    it('should render primary and secondary call-to-action links', () => {
      renderWithIntl(<Hero />);

      const primary = screen.getByRole('link', { name: 'Contactar ahora' });
      const secondary = screen.getByRole('link', { name: 'Nuestros servicios' });

      expect(primary).toHaveAttribute('href', '#contacto');
      expect(secondary).toHaveAttribute('href', '#servicios');
    });
  });
});
