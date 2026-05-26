# Contributing Guidelines

Thank you for contributing to Monday Discord Relay.

This repository is maintained as production infrastructure tooling. All changes should be treated with care, reviewed properly, and tested before being merged into protected branches.

---

## Repository Workflow

This repository uses a structured branch workflow.

| Branch | Purpose |
|------|------|
| `main` | Production-ready branch. Render production deployments should run from this branch. |
| `staging` | Pre-production validation branch used for final testing before release. |
| `development` | Active development branch for ongoing work, improvements, and testing. |
| `feature/*` | Feature branches created from `development`. |
| `fix/*` | Bug fix branches created from `development` or `staging`. |
| `hotfix/*` | Emergency production fixes created from `main`. |

---

## Branch Rules

### `main`

The `main` branch must always remain production-ready.

Changes should only reach `main` after they have been reviewed and validated through staging.

Expected flow:

```text
development → staging → main
```

---

### `staging`

The `staging` branch is used for pre-production validation.

Use this branch to confirm:

- Monday webhook behaviour
- Discord embed formatting
- Render deployment behaviour
- Environment variable compatibility
- CI validation

---

### `development`

The `development` branch is used for active work.

Feature and fix branches should usually be created from `development`.

Example:

```bash
git checkout development
git pull
git checkout -b feature/embed-improvements
```

---

## Branch Naming

Use clear branch names.

Recommended formats:

```text
feature/descriptive-feature-name
fix/descriptive-bug-fix
hotfix/descriptive-production-fix
docs/descriptive-doc-update
infra/descriptive-infrastructure-change
```

Examples:

```text
feature/multi-board-support
fix/duplicate-webhook-handling
hotfix/discord-delivery-failure
docs/update-render-guide
infra/add-ci-validation
```

---

## Pull Request Requirements

All pull requests should include:

- A clear summary
- A description of changes made
- Testing performed
- Any new environment variables
- Any deployment impact
- Confirmation that no secrets were committed

Before submitting a pull request, confirm:

- The service starts successfully
- `server.js` passes syntax validation
- No real API tokens are included
- No Discord webhook URLs are committed
- Documentation is updated if needed

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the service:

```bash
npm start
```

Run syntax validation:

```bash
node --check server.js
```

Run dependency audit:

```bash
npm audit --audit-level=high
```

---

## Environment Configuration

Use the example environment file:

```text
examples/.env.example
```

Copy it locally:

```bash
cp examples/.env.example .env
```

Never commit `.env` files.

Required variables:

```env
DISCORD_WEBHOOK_URL=
MONDAY_API_TOKEN=
TARGET_GROUP_NAME=
```

---

## Security Requirements

Do not commit:

- Monday API tokens
- Discord webhook URLs
- Render secrets
- Private environment files
- Internal credentials
- Access tokens
- Production-only configuration

If a secret is committed accidentally:

1. Rotate the secret immediately.
2. Remove it from the repository history where appropriate.
3. Notify the repository owner.
4. Open a security follow-up issue if needed.

---

## Coding Standards

Keep the code:

- Clear
- Readable
- Environment-driven
- Defensive against missing data
- Safe for production webhook handling
- Consistent with existing formatting

Avoid:

- Hardcoded studio, server, or project names
- Hardcoded secrets
- Unnecessary dependencies
- Unhandled external request failures
- Noisy production logging

---

## Commit Standards

Use clear commit titles.

Good examples:

```text
Add GitHub Actions CI validation workflow
Improve deployment embed metadata handling
Fix duplicate webhook trigger detection
Update Render deployment documentation
```

Avoid vague commits:

```text
stuff
fix
updates
final
changes
```

---

## Release Process

Recommended release flow:

```text
development → staging → main → release tag
```

Release tags should follow semantic versioning:

```text
v1.0.0
v1.1.0
v1.1.1
```

Versioning rules:

| Version Type | Meaning |
|------|------|
| Major | Breaking changes |
| Minor | New features |
| Patch | Fixes and improvements |

---

## Testing Checklist

Before merging, check:

- [ ] Node dependencies install successfully
- [ ] `server.js` passes syntax validation
- [ ] Service starts locally
- [ ] Required environment variables are documented
- [ ] Monday webhook endpoint still responds
- [ ] Discord test route remains disabled by default
- [ ] No secrets are committed
- [ ] README or examples are updated if required

---

## Production Notes

Production deployments should only run from:

```text
main
```

Staging deployments, if configured, should run from:

```text
staging
```

Development testing should not directly affect production Discord channels or production Monday boards.

---

## Ownership

This repository is maintained by Pigeon Studios.

All contributions must follow the repository license, branch protection rules, and internal development standards.