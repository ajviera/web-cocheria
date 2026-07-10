# React Component Architecture

> Applies to: `**/*.tsx`

## Folder Structure

Feature-based: code that changes together lives together. Promote to `components/` or `hooks/` only when reused by 2+ features.

```
src/
├── components/    # Shared, reusable UI
├── features/      # Feature-specific code (components, hooks, services, types)
├── hooks/         # Shared custom hooks
├── services/      # API calls
├── types/         # Shared types
└── utils/
```

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component files | PascalCase | `UserProfile.tsx` |
| Non-component files | kebab-case | `use-auth.ts` |
| Custom hooks | `use` + camelCase | `useForm` |
| Event handlers | `handle` prefix | `handleClick` |
| Boolean props/state | `is/has/should/can` | `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |

## Patterns

### Barrel Exports
Consumers import from the folder, not the file.
```tsx
// components/user-profile/index.ts
export { UserProfile } from './UserProfile';
export type { UserProfileProps } from './UserProfile';

// consumer
import { UserProfile } from '@/components/user-profile';
```

### Compound Components
Prefer composition over prop drilling for UI variations.
```tsx
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="card">{children}</div>
);
Card.Header = ({ children }: { children: React.ReactNode }) => (
  <div className="card-header">{children}</div>
);
Card.Body = ({ children }: { children: React.ReactNode }) => (
  <div className="card-body">{children}</div>
);
```

### Container / Presenter
Separate data-fetching from rendering.
```tsx
// Container: handles data/state
export const UserProfileContainer = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, error } = useUser(userId);
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return null;
  return <UserProfile user={user} />;
};

// Presenter: pure rendering
export const UserProfile = ({ user }: { user: User }) => (
  <div><h2>{user.name}</h2><p>{user.email}</p></div>
);
```

### Named Exports Only
Default exports hurt refactoring and IDE auto-import.
```tsx
export const UserCard = ({ name }: { name: string }) => <div>{name}</div>;
```

## Rules

- Keep component files **<300 lines**; extract to hooks when exceeded
- Maximum **3–4 levels** of folder nesting
- One component per file
- Colocate tests next to source (`UserCard.tsx` → `UserCard.test.tsx`)
- Stable unique IDs as `key` props — never array indexes
- Avoid `React.FC`; type props explicitly
- Don't create shared components until reused in 2+ places