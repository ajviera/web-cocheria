# React Hooks Patterns

> Applies to: `**/*.tsx, **/*.ts`

## Rules of Hooks

Enable `eslint-plugin-react-hooks` with `rules-of-hooks` (error) and `exhaustive-deps` (warn).

1. Only call hooks at the top level — never in loops, conditions, or nested functions
2. Only call hooks from React function components or custom hooks

## useState

```tsx
const [isLoading, setIsLoading] = useState(false);
const [user, setUser] = useState<User | null>(null);

// Functional update when next state depends on previous
setCount(prev => prev + 1);
```

- Don't store derived state (compute during render)
- Never mutate state directly

## useEffect

One concern per effect. Declare all deps. Clean up subscriptions.

```tsx
useEffect(() => {
  document.title = `${user.name} - Profile`;
}, [user.name]);

useEffect(() => {
  const sub = eventBus.subscribe(userId, handleEvent);
  return () => sub.unsubscribe();
}, [userId, handleEvent]);
```

- Don't call async functions directly in `useEffect` — define an inner async function
- Use `AbortController` to cancel fetches on cleanup

## useReducer

Prefer over multiple `useState`s when state has multiple related fields.

```tsx
interface State {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: User | null;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User }
  | { type: 'FETCH_ERROR'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_START': return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS': return { status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR': return { ...state, status: 'error', error: action.payload };
  }
};

const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null });
```

## Custom Hooks

One hook = one concern. Name with `use` prefix. Keep <150 lines.

```tsx
interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetch = <T,>(url: string): UseFetchResult<T> => {
  const [state, dispatch] = useReducer(fetchReducer<T>, initialState);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: T = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: (err as Error).message });
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { ...state, refetch: fetchData };
};
```

## Stabilizing Hook Returns

When a custom hook returns functions used as deps or passed to memoized children:
```tsx
export const useUserActions = (userId: string) => {
  const deleteUser = useCallback(() => api.deleteUser(userId), [userId]);
  const updateUser = useCallback((data: Partial<User>) => api.updateUser(userId, data), [userId]);
  return { deleteUser, updateUser };
};
```

## Common Hooks to Extract

`useForm`, `useFetch`, `useDebounce`, `useLocalStorage`, `usePrevious`, `useWindowSize`, `useOnClickOutside`.

## Rules

- Return only what the consumer needs (not entire state object)
- Never use `eslint-disable` for `exhaustive-deps` — fix the root cause