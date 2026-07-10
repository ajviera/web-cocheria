import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { Faq } from './Faq';

describe('Faq', () => {
  describe('when rendered', () => {
    it('should display the title', () => {
      renderWithIntl(<Faq />);

      expect(
        screen.getByRole('heading', { level: 2, name: 'Preguntas frecuentes' }),
      ).toBeInTheDocument();
    });

    it('should display all six questions and answers', () => {
      renderWithIntl(<Faq />);

      expect(
        screen.getByText('¿Qué hacer en las primeras horas tras un fallecimiento?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Ante un fallecimiento, lo primero es contactar a la cochería para coordinar el traslado del fallecido y comenzar los trámites correspondientes. En Cochería Nogués & Martínez lo asesoramos desde el primer llamado, las 24 horas, para acompañarlo en cada paso: certificado de defunción, elección de sala velatoria y organización del servicio.',
        ),
      ).toBeInTheDocument();

      expect(screen.getByText('¿Cómo los contacto ante una urgencia?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Puede comunicarse por teléfono o WhatsApp en cualquier momento, los 365 días del año. Nuestro equipo responde de inmediato para coordinar el traslado y brindarle contención desde el primer contacto.',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText('¿Gestionan sepelios para afiliados de PAMI o ANSES?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Sí. Asesoramos y gestionamos la documentación necesaria para tramitar el subsidio por sepelio ante PAMI y ANSES. El monto y los requisitos vigentes los confirmamos junto a la familia al iniciar el trámite, ya que pueden actualizarse.',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText('¿Realizan traslados fuera de José C. Paz o al exterior?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Sí, coordinamos traslados dentro del país y repatriaciones internacionales, ocupándonos de toda la documentación y logística necesaria para que el proceso sea seguro y sin trámites adicionales para la familia.',
        ),
      ).toBeInTheDocument();

      expect(screen.getByText('¿Cómo elijo entre sepelio y cremación?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Ambas opciones son igual de respetuosas; la elección depende de las creencias, los deseos de la familia y, en algunos casos, de disposiciones previas del fallecido. Nuestro equipo lo asesora sin apuro para que pueda tomar la decisión que mejor se ajuste a su situación.',
        ),
      ).toBeInTheDocument();

      expect(screen.getByText('¿Cuál es el costo de un servicio fúnebre?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'El costo varía según el tipo de servicio, la modalidad de sepelio o cremación y las coberturas disponibles (PAMI, obra social o particular). Prefiera consultarnos por teléfono o WhatsApp: le brindamos un presupuesto claro y sin compromiso, adaptado a su situación.',
        ),
      ).toBeInTheDocument();
    });

    it('should embed a valid FAQPage JSON-LD script with all six questions', () => {
      const { container } = renderWithIntl(<Faq />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();

      const jsonLd = JSON.parse(script?.innerHTML ?? '{}') as {
        '@type': string;
        mainEntity: unknown[];
      };

      expect(jsonLd['@type']).toBe('FAQPage');
      expect(jsonLd.mainEntity).toHaveLength(6);
    });
  });
});
