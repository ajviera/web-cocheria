# React TypeScript Integration

> Applies to: `**/*.tsx, **/*.ts`

## tsconfig.json

Enable strict mode.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## Component Props

Use `interface` for component props (better error messages, supports declaration merging).

```tsx
interface UserCardProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  onSelect?: (id: string) => void;
}

export const UserCard = ({ id, name, email, avatarUrl, onSelect }: UserCardProps) => (
  <div onClick={() => onSelect?.(id)}>
    {avatarUrl && <img src={avatarUrl} alt={name} />}
    <h3>{name}</h3>
    <p>{email}</p>
  </div>
);
```

## Extending HTML Element Props

For primitive components (Button, Input), pass through native attributes.

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', size = 'md', isLoading, children, ...rest }: ButtonProps) => (
  <button className={`btn btn-${variant} btn-${size}`} disabled={isLoading || rest.disabled} {...rest}>
    {isLoading ? <Spinner /> : children}
  </button>
);
```

## forwardRef

When wrapping DOM elements consumers may need to control.

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label htmlFor={props.id}>{label}</label>
      <input ref={ref} aria-invalid={!!error} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
);

Input.displayName = 'Input';
```

## Generic Components

```tsx
interface SelectProps<T> {
  options: T[];
  value: T | null;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  onChange: (value: T | null) => void;
}

export const Select = <T,>({ options, value, getOptionLabel, getOptionValue, onChange }: SelectProps<T>) => (
  <select
    value={value ? getOptionValue(value) : ''}
    onChange={(e) => onChange(options.find(o => getOptionValue(o) === e.target.value) ?? null)}
  >
    {options.map((option) => (
      <option key={getOptionValue(option)} value={getOptionValue(option)}>
        {getOptionLabel(option)}
      </option>
    ))}
  </select>
);
```

## API Types

Never use `any` for API data. Define typed interfaces in `src/types/`.

```tsx
export interface ApiResponse<T> {
  data: T;
  meta: { total: number; page: number; pageSize: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
}

export type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export const fetchUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await fetch('/api/users');
  return response.json() as Promise<ApiResponse<User[]>>;
};
```

## Typing Custom Hooks

```tsx
interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounter = (initialValue = 0): UseCounterReturn => {
  const [count, setCount] = useState(initialValue);
  return {
    count,
    increment: useCallback(() => setCount(c => c + 1), []),
    decrement: useCallback(() => setCount(c => c - 1), []),
    reset: useCallback(() => setCount(initialValue), [initialValue]),
  };
};
```

## React Type Utilities

| Utility | Use case |
|---|---|
| `React.ReactNode` | `children` prop |
| `React.ReactElement` | A single element (not null/string) |
| `React.CSSProperties` | Inline `style` objects |
| `React.ComponentProps<typeof C>` | Extract props from an existing component |
| `React.PropsWithChildren<Props>` | Add `children` to existing props |
| `React.RefObject<T>` | Typed `useRef` result |
| `React.ChangeEvent<HTMLInputElement>` | Input `onChange` event |

## Rules

- Never use `any` — use `unknown` and narrow
- `interface` for props; `type` for unions, mapped, utilities
- Don't use `React.FC` (adds implicit `children`)
- Use TS path aliases (`@/`) to avoid deep relative paths
- Export prop interfaces so consumers can extend them
- `as const` for literal arrays to preserve narrow types
- Never cast with `as` to silence type errors — fix the root cause
