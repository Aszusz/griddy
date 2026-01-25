# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**

- `npm run dev` - Start Vite development server with HMR (NEVER run this - assume the dev server is already running)
- `npm run build` - TypeScript build + Vite production build
- `npm run preview` - Preview production build

**Code Quality:**

- `npm run format:check` - Check code formatting with Prettier
- `npm run format` - Auto-format code with Prettier
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - TypeScript type checking
- `npm run all` - Run format, lint, typecheck, and test sequentially

**Testing:**

- `npm test` - Run BDD tests with Playwright
- `npm run test:ui` - Run tests in Playwright UI mode

See [TESTING.md](TESTING.md) for testing patterns and architecture.

## Architecture

This is a React + TypeScript application using Vite as the build tool and Tailwind CSS for styling.

### Store Architecture

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

### Code Style

- **Procedural over OOP** - data and functions are separate hierarchies; prefer plain functions and data structures over classes
- **Inline vs Extract** - keep simple logic (≤3 lines) inline; extract complex logic to separate functions or files. Don't over-abstract simple things.
- Prettier: no semicolons, single quotes, Tailwind class sorting
- ESLint: TypeScript-ESLint with React Hooks rules

### BDD Workflow

The project follows a structured BDD workflow with five commands:

```
/discover         → DISCOVERY.yml (structured requirements)
/formulate        → feature files (Gherkin scenarios)
/automate-red     → step definitions (tests fail)
/automate-green   → implementation (tests pass)
/automate-refactor → refactor code (tests stay green)
```
