# React State Management

> Applies to: `**/*.tsx, **/*.ts`

## Decision Guide

| Scope | Solution |
|---|---|
| Single component | `useState` / `useReducer` |
| Shared UI state across a few components | Lift state up |
| Global UI state (theme, auth, locale) | Context API |
| Server/async data | TanStack Query |
| Complex shared client state | Zustand |
| Large enterprise app with devtools | Redux Toolkit |

**Start local.** Only introduce a library when state genuinely needs to be shared.

## Context API

Use for infrequently changing global state. One context per concern.

```tsx
type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within <ThemeProvider>');
  return context;
};
```

- Always memoize the value with `useMemo`
- Always export a typed hook with an invariant guard
- Never put high-frequency updates in Context

## Zustand (Client State)

For shared state that changes frequently or spans many components.

```tsx
interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: state.items.some(i => i.id === item.id)
      ? state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...state.items, item],
  })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

// Subscribe to slices only
const itemCount = useCartStore(state => state.items.length);
const addItem = useCartStore(state => state.addItem);
```

Split stores by domain (cart, auth, ui). Never subscribe to the full store.

## TanStack Query (Server State)

Use for all server-fetched data. Handles caching, refetching, dedup.

```tsx
export const useUser = (userId: string) =>
  useQuery({
    queryKey: ['users', userId],
    queryFn: () => api.fetchUser(userId),
    staleTime: 5 * 60 * 1000,
  });

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      api.updateUser(id, data),
    onSuccess: (user) => queryClient.invalidateQueries({ queryKey: ['users', user.id] }),
  });
};
```

**Always set `staleTime`** — default 0 causes excessive refetching.

## Rules

- Never store server data in Zustand or Context alongside TanStack Query — TQ owns the cache
- Keep Context providers close to where they're needed, not always at the root
- Don't store derived values — compute during render or with `useMemo`