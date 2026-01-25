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

See [TESTING.md](docs/TESTING.md) for testing patterns and architecture.

## Architecture

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture patterns, store structure, and code style guidelines.
