import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { About } from './About';

describe('About', () => {
  describe('when rendered', () => {
    it('should display the title and both paragraphs', () => {
      renderWithIntl(<About />);

      expect(
        screen.getByRole('heading', { level: 2, name: 'Un acompañamiento humano y profesional' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'En Cocheria Nogues & Martinez brindamos un servicio funerario integral y personalizado, acompañando a las familias con respeto, calidez y profesionalismo en cada etapa del proceso. Nuestro compromiso es ofrecer tranquilidad, contención y un servicio de excelencia en los momentos más difíciles.',
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Contamos con un equipo de profesionales capacitados para asesorarlo en todo lo relacionado con servicios funerarios, incluyendo sepelios, cremaciones, traslados, gestiones ante PAMI y otros trámites necesarios, brindando acompañamiento y soluciones de manera clara, responsable y cercana.',
        ),
      ).toBeInTheDocument();
    });

    it('should render the four highlights', () => {
      renderWithIntl(<About />);

      expect(screen.getByText('Modernas salas velatorias')).toBeInTheDocument();
      expect(screen.getByText('Equipo humano y capacitado')).toBeInTheDocument();
      expect(screen.getByText('Servicio integral y personalizado')).toBeInTheDocument();
      expect(screen.getByText('Gestión de trámites y PAMI')).toBeInTheDocument();
    });
  });
});
