# Wedding Planner — Development Guide

This document establishes the development workflow, Git conventions, and coding standards for the Wedding Planner application.

The goal is to maintain a consistent, organized, and professional development process throughout the project.

## 1. Development Workflow

Every feature, bug fix, or significant development task should follow this process:

**GitHub Issue → Create Branch → Develop → Test → Commit → Push → Pull Request → Merge**

### Step 1: Select a GitHub Issue

Before starting development:

1. Open the Wedding Planner GitHub Project.
2. Select an issue from the Todo column.
3. Review the description and acceptance criteria.
4. Move the issue to In Progress.
5. Create a branch associated with the issue.

Avoid working on multiple unrelated issues in the same branch.

### Step 2: Create a Feature Branch

Start from the latest version of `main`.

```bash
git switch main
git pull origin main
```

Create a new branch:

```bash
git switch -c feature/initial-database-schema
```

Verify your current branch:

```bash
git branch
```

Never develop new features directly on `main`.

## 2. Branch Naming Conventions

Use lowercase letters and hyphens to separate words.

Format:

`type/short-description`

| Type | Usage | Example |
|---|---|---|
| `feature/` | New functionality | `feature/guest-management` |
| `fix/` | Bug fixes | `fix/login-error` |
| `chore/` | Maintenance and setup | `chore/backend-setup` |
| `docs/` | Documentation updates | `docs/update-readme` |
| `refactor/` | Improve existing code | `refactor/auth-service` |
| `test/` | Add or update tests | `test/guest-api` |

Optional: Include the GitHub issue number, such as `feature/12-guest-management`.

## 3. Commit Message Conventions

Use Conventional Commits to maintain a readable Git history.

Format:

`type: short description`

Examples:

```bash
git commit -m "feat: create wedding database schema"
git commit -m "fix: resolve guest registration error"
git commit -m "chore: configure Prisma"
git commit -m "docs: update development guide"
git commit -m "refactor: simplify authentication middleware"
git commit -m "test: add guest endpoint tests"
```

Common prefixes:

- `feat:` New feature
- `fix:` Bug fix
- `chore:` Configuration or maintenance
- `docs:` Documentation
- `refactor:` Code improvements without changing functionality
- `test:` Tests

Keep commits small and focused on a specific change.

## 4. Saving and Pushing Work

After making changes, check your working directory:

```bash
git status
```

Stage your changes:

```bash
git add .
```

Commit your changes:

```bash
git commit -m "feat: create initial database schema"
```

Push your branch:

```bash
git push -u origin feature/initial-database-schema
```

For subsequent pushes on the same branch:

```bash
git push
```

Before committing, verify that no passwords, database credentials, or `.env` files are being tracked.

## 5. Pull Request Workflow

When a feature is complete:

1. Push your changes to GitHub.
2. Open a pull request targeting `main`.
3. Add a descriptive title.
4. Explain the changes.
5. Link the related GitHub issue.
6. Verify the acceptance criteria.
7. Review the code and tests.
8. Merge the pull request.

### Pull Request Template

**Summary**
Describe what was implemented.

**Changes**
- Describe important changes.
- Mention new endpoints, database models, or components.

**Testing**
- Describe how functionality was tested.

**Related Issue**
Closes #12

Replace `12` with the actual GitHub issue number.

## 6. After Merging

Switch back to the main branch:

```bash
git switch main
```

Get the latest changes:

```bash
git pull origin main
```

Delete the completed local branch:

```bash
git branch -d feature/initial-database-schema
```

Move the next GitHub issue to In Progress and create a new branch.

## 7. Project Coding Conventions

### TypeScript

- Use TypeScript for application code.
- Prefer `const` over `let` where possible.
- Avoid using `any` unnecessarily.
- Define interfaces or types for structured data.
- Use descriptive variable and function names.
- Follow existing project formatting and linting rules.

### React Frontend

- Use functional components and React hooks.
- Keep components focused on a single responsibility.
- Separate reusable components from pages.
- Keep API request logic organized in dedicated service modules.
- Use consistent naming conventions.
- Prefer CSS-based styling over unnecessary UI dependencies.

### Express Backend

- Organize backend code into routes, controllers, and services.
- Keep business logic out of route declarations.
- Use middleware for shared functionality.
- Validate incoming request data.
- Handle errors consistently.
- Store sensitive configuration in environment variables.

### Prisma and Database

- Define database models in `schema.prisma`.
- Use descriptive model and field names.
- Add relationships and constraints where appropriate.
- Use migrations to track schema changes.
- Commit migration files alongside schema changes.
- Do not modify applied production migrations.
- Never commit database passwords or credentials.

## 8. Definition of Done

An issue is considered complete when:

- [ ] All acceptance criteria are satisfied.
- [ ] The functionality works as expected.
- [ ] Relevant tests have passed.
- [ ] Code follows established conventions.
- [ ] No unnecessary debugging code remains.
- [ ] Documentation is updated if needed.
- [ ] Changes are committed and pushed.
- [ ] A pull request has been reviewed and merged.
- [ ] The GitHub issue is closed.

## 9. GitHub Project Statuses

Use the following workflow:

| Status | Meaning |
|---|---|
| Backlog | Future work not yet prioritized |
| Todo | Ready to begin |
| In Progress | Currently being developed |
| In Review | Pull request opened |
| Done | Changes merged and issue complete |

Keep GitHub Projects updated as development progresses.

## 10. Quick Git Reference

| Action | Command |
|---|---|
| Check status | `git status` |
| List branches | `git branch` |
| Switch branches | `git switch branch-name` |
| Create branch | `git switch -c branch-name` |
| Return to main | `git switch main` |
| Update main | `git pull origin main` |
| Stage changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push new branch | `git push -u origin branch-name` |
| Push changes | `git push` |
| Delete merged branch | `git branch -d branch-name` |

---

## Development Principles

1. Plan work before writing code.
2. Create one branch per issue or focused task.
3. Keep commits small and meaningful.
4. Test code before opening pull requests.
5. Use GitHub Projects to track progress.
6. Keep the main branch stable.
7. Document important architectural decisions.
8. Prioritize clean, maintainable code over unnecessary complexity.

**Consistency is more important than perfection.** Update this guide as the application grows and new development practices are adopted.