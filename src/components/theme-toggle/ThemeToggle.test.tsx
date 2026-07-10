import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@/test-utils/render-with-intl';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const renderToggle = () =>
  renderWithIntl(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should render a button labelled to switch to dark mode by default', () => {
    renderToggle();

    expect(
      screen.getByRole('button', { name: 'Cambiar a modo oscuro' }),
    ).toBeInTheDocument();
  });

  it('should switch its aria-label to light mode after a click', async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole('button', { name: 'Cambiar a modo oscuro' }));

    expect(
      screen.getByRole('button', { name: 'Cambiar a modo claro' }),
    ).toBeInTheDocument();
  });

  it('should switch back to the dark-mode label on a second click', async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = screen.getByRole('button', { name: 'Cambiar a modo oscuro' });
    await user.click(button);
    await user.click(screen.getByRole('button', { name: 'Cambiar a modo claro' }));

    expect(
      screen.getByRole('button', { name: 'Cambiar a modo oscuro' }),
    ).toBeInTheDocument();
  });
});
