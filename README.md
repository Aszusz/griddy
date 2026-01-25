# React + TypeScript + Vite Template

A React template with TDD/BDD workflows powered by Claude Code.

## Use This Template

1. Click **Use this template** > **Create a new repository** on GitHub
2. Clone your new repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## GitHub Token Setup

The template uses GitHub MCP for issue management. Generate a Personal Access Token:

1. Go to [GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)
2. Set **Repository access** to your repository
3. Under **Permissions**, enable:
   - Contents: Read and write
   - Issues: Read and write
   - Pull requests: Read and write
4. Copy the token and add it to `.env`:
   ```bash
   cp .env.example .env
   # Edit .env and add your token
   ```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run all       # Format, lint, typecheck, test
```

## Claude Code Workflow

```
/implement-issue <number>
```

Implements a GitHub issue end-to-end: creates branch, writes code, runs tests, and opens a PR.

The workflow is determined by issue labels:

| Labels                            | Workflow                 |
| --------------------------------- | ------------------------ |
| `design`, `ui`, `frontend`        | Visual iteration         |
| `bug`, `fix`, `hotfix`            | Regression test + fix    |
| `refactor`, `chore`               | Pure refactoring         |
| `feature`, `enhancement`, or none | TDD (red/green/refactor) |
