# React Testing Standards

> Applies to: `**/*.test.tsx, **/*.spec.tsx, **/*.test.ts`

Test behavior from the user's perspective using React Testing Library + Jest.

## Structure

Arrange-Act-Assert pattern.

```tsx
describe('ComponentName', () => {
  describe('scenario', () => {
    it('should <expected behavior> when <condition>', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Component Tests

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  describe('when user selects the card', () => {
    it('should call onSelect with the user id', async () => {
      const handleSelect = jest.fn();
      const user = userEvent.setup();
      render(<UserCard id="1" name="Alice" email="alice@example.com" onSelect={handleSelect} />);

      await user.click(screen.getByRole('button', { name: /alice/i }));

      expect(handleSelect).toHaveBeenCalledWith('1');
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });
  });
});
```

## Query Priority

Most semantic → least semantic:

1. `getByRole` — preferred (reflects accessible UI)
2. `getByLabelText` — form inputs
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` — last resort

## Async Testing

Use `findBy` for elements appearing asynchronously. Always `await` `userEvent` interactions.

```tsx
it('should display user data after loading', async () => {
  jest.mocked(api.fetchUser).mockResolvedValue({ id: '1', name: 'Alice' });
  render(<UserProfile userId="1" />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText('Alice')).toBeInTheDocument();
});
```

## Hook Tests

```tsx
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment the count', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => { result.current.increment(); });
    expect(result.current.count).toBe(1);
  });
});
```

## Mocking

Mock at the module level. Use `jest.mocked()` for type-safe access.

```tsx
jest.mock('@/services/api', () => ({
  fetchUser: jest.fn(),
  updateUser: jest.fn(),
}));

import { fetchUser } from '@/services/api';

beforeEach(() => { jest.clearAllMocks(); });

it('should call fetchUser with the correct id', async () => {
  jest.mocked(fetchUser).mockResolvedValue({ id: '1', name: 'Alice' });
  render(<UserProfile userId="1" />);
  await screen.findByText('Alice');
  expect(fetchUser).toHaveBeenCalledWith('1');
});
```

## jest-dom Matchers

```tsx
import '@testing-library/jest-dom';

expect(el).toBeInTheDocument();
expect(el).toBeDisabled();
expect(el).toBeVisible();
expect(input).toHaveValue('alice@example.com');
expect(el).toHaveClass('active');
expect(el).toHaveAttribute('aria-expanded', 'true');
```

## Setup

```js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};

// src/setupTests.ts
import '@testing-library/jest-dom';
```

## What to Test

- Renders with props
- User interactions (click, type, submit)
- Loading / error / empty states
- Conditional rendering
- Accessibility (ARIA roles/labels)

## What NOT to Test

- CSS class names or styles
- Internal component state
- Third-party library behavior
- React lifecycle method calls

## Rules

- Use `userEvent`, not `fireEvent`
- `findBy` for async; `getBy` for immediate; `queryBy` for "not present"
- Don't use `waitFor` when `findBy` works
- Wrap state updates in `act` when testing hooks directly
- Mock at the boundary (API layer), not at internal function level

## Coverage

Each testable source file must have **100% coverage** (statements, branches, functions, lines).

**Non-testable files** (excluded from coverage): barrel exports (`index.ts/tsx`), type-only
files (`src/types/`), CSS (`src/styles/`), i18n config (`src/i18n/`), test utilities
(`src/test-utils/`).

**Optimization rule:** Do NOT run `jest --coverage` after each file change — it is slow.
- To verify tests pass: `jest --testPathPatterns=<filename>` (fast, no coverage)
- To check coverage: `npm run test:coverage` (run only at the end of a test session)
- To enforce per-file 100%: `npm run test:coverage:check`
