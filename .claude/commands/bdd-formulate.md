# BDD Formulate Session

Transform SPEC.yml into Gherkin scenarios.

## Phase 1: Context Gathering

1. Read the project's SPEC.yml - if missing, tell user to run `/bdd-discover` first
2. Read project testing docs for file locations and patterns
3. Search existing `.feature` files for reusable steps
4. Read feature files related to spec's integration points

## Phase 2: Integration Analysis

New spec does not always equal new feature file. This is not a 1:1 translation.

Consider the full test landscape:

- Existing scenarios may need **deletion** (contradicted by new spec)
- Existing scenarios may need **modification** (partial overlap)
- New scenarios may belong in **existing features** (same capability)
- Create new `.feature` when no existing file covers the capability

Errors here propagate to implementation. Take time to understand how new requirements integrate with existing tests.

## Phase 3: Scenario Formulation

### Core Principle

Describe **what** not **how**. Test: "Will this break if implementation changes?" If yes, rewrite.

```gherkin
# Bad - coupled to UI
When I type "bob@example.com" in the "email" field
And I click the "submit" button

# Good - behavior only
When Bob logs in with valid credentials
```

### Style Rules

1. **Declarative** - "Bob logs in" not "Bob types password, clicks submit"
2. **Single behavior** - one When, one behavior; split if using "and also"
3. **User-visible outcomes** - Then describes what user sees
4. **Reuse steps** - grep existing features before inventing new steps

For syntax (Background, Scenario Outline, etc.) follow project testing docs.

### Avoid

- UI mechanics (click, type, element selectors)
- Implementation details (store state, API responses)
- Vague outcomes ("works", "is correct")
- Multiple actions in When

## Phase 4: Write Files

1. Create/update `.feature` files per project testing docs
2. Each spec requirement maps to at least one scenario
3. Happy path first, then edge cases
4. Output diff summary of changes made
