# BDD Discovery Session

Conduct a BDD discovery session to transform a vague software idea into a structured specification.

## Input

The user will provide: $ARGUMENTS

If no arguments provided, ask what they want to build.

## Phase 1: Feature Exploration

Before asking questions, read existing `.feature` files to understand what behaviors already exist.

1. Check TESTING.md for feature file locations
2. Read relevant feature files
3. Determine if this modifies an existing feature or is new

Present findings briefly:

- Related features found
- New vs modification to existing
- How it fits with existing behaviors

## Phase 2: Three Amigos Discovery

This is a Three Amigos session with assigned roles:

| Role              | Player | Focus                                              |
| ----------------- | ------ | -------------------------------------------------- |
| **Product Owner** | User   | What to build and why                              |
| **Developer**     | AI     | Technical feasibility, integration, implementation |
| **Tester**        | AI     | Edge cases, error scenarios, what could go wrong   |

Use the `AskUserQuestion` tool to conduct the discovery conversation. Ask questions iteratively, not all at once.

### Discovery Questions

1. **What is being built?** - Clear, concise name and description
2. **What type of change?** - feature, bugfix, refactor, mvp, styling, or other
3. **What are the requirements?** - High-level behavioral or visual requirements (NOT Given/When/Then - those come in formulate phase)
4. **What's the scope?**
   - Breadth: How many areas of the codebase are affected? (narrow/medium/wide)
   - Depth: How many stack layers are involved? (shallow/medium/deep)
5. **What's NOT included?** - Explicitly define out-of-scope items to prevent scope creep
6. **What existing systems does this touch?** - APIs, components, services
7. **What blockers exist?** - Missing systems or decisions that must be resolved first

Ask questions conversationally. Have a dialogue to explore the idea thoroughly.

## Phase 3: Output

After discovery is complete, create `docs/tmp/SPEC.yml` in the project root:

```yaml
name: 'Short descriptive name'
description: 'One sentence describing what this changes'
type: 'feature|bugfix|refactor|mvp|styling|other'

requirements:
  - 'Specific behavioral or visual requirement'
  - 'Another requirement'

out_of_scope:
  - "What we're NOT doing"
  - 'Excluded functionality'

integration_points:
  - 'Existing system/feature that must be modified'
```

## Guidelines

- Be thorough but conversational - collaborative discovery, not interrogation
- Push back on vague requirements - ask for concrete examples
- Help identify edge cases and potential issues early
- If blockers exist, discuss whether to proceed or address blockers first
- The goal is clarity before implementation begins
