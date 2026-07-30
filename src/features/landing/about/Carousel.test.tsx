import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';

const IMAGES = [
  { src: '/flowers/a.jpg', alt: 'Corona de crisantemos blancos' },
  { src: '/flowers/b.jpg', alt: 'Corona de rosas rojas' },
  { src: '/flowers/c.jpg', alt: 'Corona en tonos pastel' },
];

const renderCarousel = (props: Partial<React.ComponentProps<typeof Carousel>> = {}) =>
  render(
    <Carousel
      images={IMAGES}
      regionLabel="Galería"
      previousLabel="Anterior"
      nextLabel="Siguiente"
      goToLabel={position => `Ir a la foto ${position}`}
      {...props}
    />,
  );

const dot = (position: number) =>
  screen.getByRole('button', { name: `Ir a la foto ${position}` });
const region = () => screen.getByRole('group', { name: 'Galería' });
const track = (container: HTMLElement) =>
  container.querySelector('[data-dragging]') as HTMLElement;

// jsdom's PointerEvent ignores clientX from its init dict, so dispatch a
// coordinate-bearing MouseEvent under the pointer event type instead.
const pointer = (el: HTMLElement, type: string, clientX: number) =>
  fireEvent(el, new MouseEvent(type, { clientX, bubbles: true, cancelable: true }));

const setReducedMotion = (matches: boolean) =>
  (window.matchMedia as jest.Mock).mockReturnValue({
    matches,
    media: '',
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

afterEach(() => {
  setReducedMotion(false);
  jest.useRealTimers();
});

describe('Carousel', () => {
  describe('when rendered', () => {
    it('should render one image and one dot per photo, starting on the first', () => {
      const { container } = renderCarousel();

      expect(container.querySelectorAll('img')).toHaveLength(3);
      expect(screen.getAllByRole('button', { name: /Ir a la foto/ })).toHaveLength(3);
      expect(dot(1)).toHaveAttribute('aria-current', 'true');
      expect(dot(2)).toHaveAttribute('aria-current', 'false');
    });

    // Only the active slide is exposed to assistive tech (the rest are
    // aria-hidden), so query with `hidden: true` to reach every photo's alt.
    it('should give every photo its own descriptive alt text', () => {
      renderCarousel();

      IMAGES.forEach(({ alt }) => {
        expect(screen.getByRole('img', { name: alt, hidden: true })).toBeInTheDocument();
      });
    });
  });

  describe('when using the arrows', () => {
    it('should advance to the next photo', async () => {
      const user = userEvent.setup();
      renderCarousel();

      await user.click(screen.getByRole('button', { name: 'Siguiente' }));

      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });

    it('should wrap to the last photo when going back from the first', async () => {
      const user = userEvent.setup();
      renderCarousel();

      await user.click(screen.getByRole('button', { name: 'Anterior' }));

      expect(dot(3)).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('when clicking a dot', () => {
    it('should jump to that photo', async () => {
      const user = userEvent.setup();
      renderCarousel();

      await user.click(dot(3));

      expect(dot(3)).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('autoplay', () => {
    it('should advance on its own after the interval', () => {
      jest.useFakeTimers();
      renderCarousel({ autoPlayMs: 1000 });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });

    it('should not advance when the user prefers reduced motion', () => {
      setReducedMotion(true);
      jest.useFakeTimers();
      renderCarousel({ autoPlayMs: 1000 });

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(dot(1)).toHaveAttribute('aria-current', 'true');
    });

    it('should not advance with a single photo', () => {
      jest.useFakeTimers();
      renderCarousel({
        images: [{ src: '/flowers/only.jpg', alt: 'Corona de flores blancas' }],
        autoPlayMs: 1000,
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(dot(1)).toHaveAttribute('aria-current', 'true');
    });

    it('should pause while hovered and resume on leave', () => {
      jest.useFakeTimers();
      renderCarousel({ autoPlayMs: 1000 });

      fireEvent.mouseEnter(region());
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(dot(1)).toHaveAttribute('aria-current', 'true');

      fireEvent.mouseLeave(region());
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });

    it('should pause while focused and resume on blur', () => {
      jest.useFakeTimers();
      renderCarousel({ autoPlayMs: 1000 });

      fireEvent.focusIn(region());
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(dot(1)).toHaveAttribute('aria-current', 'true');

      fireEvent.focusOut(region());
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });
  });

  describe('when dragging', () => {
    it('should advance when swiped far enough to the left', () => {
      const { container } = renderCarousel();
      const el = track(container);
      el.setPointerCapture = jest.fn();

      pointer(el, 'pointerdown', 200);
      pointer(el, 'pointermove', 120);
      pointer(el, 'pointerup', 120);

      expect(el.setPointerCapture).toHaveBeenCalled();
      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });

    it('should go back when swiped far enough to the right', () => {
      const { container } = renderCarousel();
      const el = track(container);

      pointer(el, 'pointerdown', 100);
      pointer(el, 'pointermove', 220);
      pointer(el, 'pointerup', 220);

      expect(dot(3)).toHaveAttribute('aria-current', 'true');
    });

    it('should stay put when the swipe is below the threshold', () => {
      const { container } = renderCarousel();
      const el = track(container);

      pointer(el, 'pointerdown', 200);
      pointer(el, 'pointermove', 182);
      pointer(el, 'pointerup', 182);

      expect(dot(1)).toHaveAttribute('aria-current', 'true');
    });

    it('should commit the swipe when the pointer is cancelled', () => {
      const { container } = renderCarousel();
      const el = track(container);

      pointer(el, 'pointerdown', 200);
      pointer(el, 'pointermove', 120);
      pointer(el, 'pointercancel', 120);

      expect(dot(2)).toHaveAttribute('aria-current', 'true');
    });

    it('should ignore pointer movement and release without a press', () => {
      const { container } = renderCarousel();
      const el = track(container);

      pointer(el, 'pointermove', 50);
      pointer(el, 'pointerup', 50);

      expect(dot(1)).toHaveAttribute('aria-current', 'true');
    });
  });
});
