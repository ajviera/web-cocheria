import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  describe('when rendered', () => {
    it('should embed the given data as a JSON-LD script tag', () => {
      const data = { '@context': 'https://schema.org', '@type': 'FuneralHome', name: 'Test' };
      const { container } = render(<JsonLd data={data} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(JSON.parse(script?.innerHTML ?? '')).toEqual(data);
    });
  });
});
