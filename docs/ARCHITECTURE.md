# Architecture

React + TypeScript + Vite + Tailwind CSS.

## Store Structure

```
src/store/
├── index.ts          # store configuration, root reducer, middleware composition
├── state.ts          # state interfaces and initial state
├── actions.ts        # action definitions using disc-union
├── reducers.ts       # reducer functions using disc-union match
├── selectors.ts      # selector functions
├── effects.ts        # side effect types and defaults for dependency injection
└── middleware/       # middleware with dependency injection for testability

src/hooks/
└── index.ts          # typed hooks (useAppDispatch, useAppSelector)
```

## Violations

### Store

- VIOLATION: derived data in state (use selector)
- VIOLATION: action without namespace (`ui/`, `eff/`, `fs/`, `shell/`)
- VIOLATION: raw `useDispatch`/`useSelector` (use typed hooks)
- VIOLATION: side effect in reducer (use middleware)
- VIOLATION: pure logic in middleware (use reducer)
- VIOLATION: logic in component (pure → reducer, effects → middleware, React → hook)

### Components

- VIOLATION: component >100 lines outside `src/components/`
- VIOLATION: colocated helper >50 lines
- VIOLATION: reusable component not in own file

### Constants

- VIOLATION: inline hex color or magic number (→ `src/constants.ts`)
- VIOLATION: duplicated pure helper (→ `src/utils.ts`)

### React

- VIOLATION: mutating `let` during render (use index or `.flatMap()`)
- VIOLATION: redundant type annotation
- VIOLATION: unmemoized expensive calculation

### Style

- VIOLATION: class where function + data suffices
- VIOLATION: abstraction for single-use ≤3 line logic

## Tooling

- Prettier: no semicolons, single quotes, Tailwind sorting
- ESLint: TypeScript-ESLint + React Hooks
