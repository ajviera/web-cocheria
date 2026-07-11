import { screen } from '@testing-library/react';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import HomePage from './page';

describe('HomePage', () => {
  describe('when rendered', () => {
    it('should render the landing page', () => {
      renderWithIntl(<HomePage />);

      expect(screen.getByRole('link', { name: 'Cocheria Nogues & Martinez' })).toBeInTheDocument();
    });
  });
});
