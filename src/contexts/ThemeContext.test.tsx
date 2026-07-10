import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

const STORAGE_KEY = 'cocheria-theme';

const Consumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button type="button" onClick={toggleTheme}>
        toggle
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('ThemeProvider', () => {
    it('should default to the light theme and reflect it on <html>', () => {
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });

    it('should adopt a valid persisted theme from localStorage on mount', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });

    it('should ignore an invalid persisted value and keep the default theme', () => {
      localStorage.setItem(STORAGE_KEY, 'blue');

      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>,
      );

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });

    it('should toggle between dark and light, persisting each change', async () => {
      const user = userEvent.setup();
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>,
      );

      await user.click(screen.getByRole('button', { name: 'toggle' }));

      expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');

      await user.click(screen.getByRole('button', { name: 'toggle' }));

      expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
    });
  });

  describe('useTheme', () => {
    it('should throw an error when used outside of a ThemeProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<Consumer />)).toThrow(
        'useTheme must be used within <ThemeProvider>',
      );

      consoleError.mockRestore();
    });
  });
});
