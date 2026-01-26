# Architecture

This is a React + TypeScript application using Vite as the build tool and Tailwind CSS for styling.

## Store Architecture

The app uses Redux with a **layer-based architecture** (not feature slices). Organize by layer (state, actions, reducers, selectors, middleware) to separate pure functions from effects:

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

**Key patterns:**

- **Minimal, normalized state** - store only essential data; derive everything else through selectors
- **disc-union** for type-safe discriminated union actions with `'type'` discriminant
- **Namespaced actions** - prefix actions by source/layer (e.g., `ui/`, `eff/`, `fs/`, `shell/`)
- **Typed hooks**: `useAppDispatch` and `useAppSelector` instead of raw redux hooks
- **Dependency injection** in middleware for testability (side effects as parameters with defaults)
- **React components** - avoid `useEffect`; rely on `useAppDispatch` and `useAppSelector` for state management

**Middleware vs Reducer responsibilities:**

- **Middleware** handles side effects only: timers, random numbers, API calls, reading external state. Pass all necessary data as action payload.
- **Reducers** handle all pure logic: state transitions, calculations, decisions. If logic doesn't require side effects, it belongs in the reducer.
- Actions from middleware (prefixed `eff/`) should carry any externally-generated data the reducer needs to make decisions purely.

## Component Architecture

- **One component per file** when >100 lines or reusable
- **Extract to `src/components/`** - large or reusable components get their own file
- **Colocate** small helper components in same file only if single-use and <50 lines

## Constants & Utilities

- **Colors, dimensions** → `src/constants.ts` (not inline hex codes)
- **Pure helpers** → `src/utils.ts` or domain-specific file
- **Shape defaults** (fill, stroke) → store state or constants, not hardcoded in render

## React Patterns

- **No mutations during render** - avoid `let` counters in `.map()`; use index param or `.flatMap()`
- **Avoid redundant type annotations** - let TS infer from selectors
- **Memoize expensive derived values** with `useMemo`

## Code Style

- **Procedural over OOP** - data and functions are separate hierarchies; prefer plain functions and data structures over classes
- **Inline vs Extract** - keep simple logic (≤3 lines) inline; extract complex logic to separate functions or files. Don't over-abstract simple things.
- Prettier: no semicolons, single quotes, Tailwind class sorting
- ESLint: TypeScript-ESLint with React Hooks rules
