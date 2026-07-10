# React Performance Optimization

> Applies to: `**/*.tsx`

**Profile first with React DevTools Profiler.** Premature optimization creates stale closure bugs and adds complexity.

## When to Optimize

- Component re-renders more than expected in the Profiler
- Computation takes >1ms in the flame chart
- List has >100 items and scrolls poorly
- Route transitions are slow

## React.memo

Use only for expensive renders or components with stable props that re-render too often.

```tsx
export const UserRow = React.memo(({ user, onDelete }: UserRowProps) => (
  <tr>
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td><button onClick={() => onDelete(user.id)}>Delete</button></td>
  </tr>
));
UserRow.displayName = 'UserRow';
```

Don't memoize trivially cheap components.

## useCallback

Stabilize function refs passed to memoized children. Without it, `React.memo` is useless.

```tsx
const UserList = ({ users }: { users: User[] }) => {
  const handleDelete = useCallback(async (id: string) => {
    await api.deleteUser(id);
  }, []);

  return <ul>{users.map(user =>
    <UserRow key={user.id} user={user} onDelete={handleDelete} />
  )}</ul>;
};
```

## useMemo

Memoize expensive computations only.

```tsx
const filteredProducts = useMemo(
  () => products
    .filter(p => p.category === filters.category && p.price <= filters.maxPrice)
    .sort((a, b) => a.name.localeCompare(b.name)),
  [products, filters.category, filters.maxPrice],
);
```

Don't memoize trivial operations (overhead exceeds savings).

## Code Splitting

Lazy-load routes by default.

```tsx
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));

export const AppRoutes = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Suspense>
);
```

## List Virtualization

Virtualize any list that can grow beyond 100 items (`react-window`, `react-virtual`).

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={users.length} itemSize={60} width="100%">
  {({ index, style }) => <div style={style}><UserRow user={users[index]} /></div>}
</FixedSizeList>
```

## Stable Keys

```tsx
{users.map(user => <UserRow key={user.id} user={user} />)}  // stable ID
```

Never use array index or `Math.random()` as key.

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| New objects in render | Move to `useMemo` or outside component |
| Inline `style={{...}}` | CSS classes or `useMemo` |
| Inline arrow handlers | `useCallback` |
| `useCallback` without memoized children | Remove it — no benefit |
| `useMemo` for cheap ops | Remove it — overhead > savings |

## Rules

- Profile in production mode (dev is intentionally slower)
- Add `displayName` to `memo`/`forwardRef` components