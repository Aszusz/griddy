# TDD Refactor Phase

Improve code quality without changing behavior. Tests must stay green.

## Phase 1: Identify Scope

1. Read `CLAUDE.md` for verification commands
2. Check `git diff --cached` for staged changes
3. If empty, read `docs/tmp/SPEC.yml` and infer recently touched files
4. Read `docs/ARCHITECTURE.md` - these are the rules to enforce

## Phase 2: Analyze

Review implementation files (`src/`) and test files (`test/`) for:

- Architecture violations from ARCHITECTURE.md
- Dead code (unused functions, unreachable branches)
- Dead test steps (steps not used by any feature)
- Hardcoded values that should be constants
- Components that should be extracted
- Duplicated logic that should be shared
- Render-time mutations or anti-patterns

## Phase 3: Refactor

For each issue found:

1. Fix the issue
2. Run `npm run check` and `npm run test:feature <name>` for affected features
3. If tests break, revert and reconsider approach

**Rules:**

- Never change behavior - tests must stay green
- Refactor both implementation AND test steps
- Remove dead code aggressively
- Follow ARCHITECTURE.md relentlessly
- Never stage changes (no `git add`)

## Phase 4: Iterate

Repeat Phase 2-3 until no issues remain.

Run `npm run check` and test affected features. Must pass.

Output: changes made, files refactored, what was removed.
