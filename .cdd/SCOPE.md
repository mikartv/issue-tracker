# Scope — issue-tracker v1

## Product goal

Minimal internal issue tracker: projects, issues, statuses, comments.
Single-team, no multi-tenant in v1.

## Source of truth

| Surface | Canonical source | Notes |
|---------|------------------|-------|
| Product boundary | `.cdd/SCOPE.md` | in/out scope, constraints |
| Stack & conventions | `.cdd/STACK.md` | layout, versions, patterns |
| Cycle list | `.cdd/ISSUES.md` | index only |
| Per-cycle contract | `.cdd/issues/N/ISSUE.md` | gap, AC, non-goals for dispatch |
| Project MCP | `.cdd/PROJECT.md` | verified repo map, build/test (updated each cycle) |
| DB schema (from cycle 2) | `apps/api/src/migrations/` | TypeORM migrations |
| API shape (from cycle 3) | Swagger at `/api/docs` | generated from Nest decorators |
| UI routes (from cycle 6) | `apps/web/src/app/app.routes.ts` | |

When sections conflict, per-cycle `ISSUE.md` governs that cycle; project-level docs govern cross-cycle defaults.

## In scope (v1)

- Projects: create, list, rename, archive (no hard delete)
- Issues: title, description, status, priority, assignee (nullable string/email), project_id
- Status workflow: `open` | `in_progress` | `done` | `closed` (free transitions between any valid status; invalid values rejected with 400)
- Priority: `low` | `medium` | `high` | `critical` (default `medium`)
- Comments on issues (author string, body, timestamps; no edit/delete in v1)
- REST API (NestJS) + Angular SPA
- PostgreSQL via Docker Compose for local dev
- API documented (OpenAPI/Swagger)
- Unit tests (services) + integration tests (API + DB)
- README: how to run api + web + db

Cycles are defined in `.cdd/ISSUES.md`.

## Out of scope (v1 — explicit non-goals)

- OAuth / SSO / JWT auth (optional `X-User-Email` header stub only — see constraints)
- Real-time (WebSockets)
- File attachments
- Email notifications
- Full RBAC / permissions matrix
- Mobile app
- Production K8s deploy
- Hard delete of projects or issues
- Comment edit/delete
- User accounts table / assignee picker backed by DB users
- Issue search, filters beyond list-by-project, pagination (nice-to-have; not v1 unless added to a cycle AC)

## Active design constraints

- **Auth stub:** optional request header `X-User-Email`. If absent or empty, actor is `"anonymous"`. Used for comment author and audit fields only; no enforcement beyond logging the value.
- **Status transitions:** any transition between valid `IssueStatus` values (`open` | `in_progress` | `done` | `closed`) is accepted. Invalid status values are rejected with `400` by DTO validation.
- **Archived projects:** readable and listable; `PATCH` rename on archived project → `409`; `POST` archive when already archived → `409`; creating new issues in an archived project → `409`.
- **Assignee:** free-text string stored as-is; no validation beyond max length (255); nullable.
- **Timestamps:** all stored and returned in UTC ISO-8601 (`timestamptz` in Postgres).
- **IDs:** UUID v4 for all primary keys, exposed as strings in JSON.

## Data model (v1)

All entities include `id` (UUID pk), `created_at`, `updated_at` (`timestamptz`, UTC in JSON).

| Entity | Fields | Constraints |
|--------|--------|-------------|
| **Project** | `name`, `archived` | `name` required, max 255 chars; `archived` boolean default `false` |
| **Issue** | `project_id`, `title`, `description`, `status`, `priority`, `assignee` | `title` required, max 255; `description` nullable text; `status` / `priority` per enums above; `assignee` nullable, max 255 |
| **Comment** | `issue_id`, `author`, `body` | `author` required, max 255; `body` required text; no `updated_at` semantics (immutable in v1) |

FK: `Issue.project_id` → `Project.id`; `Comment.issue_id` → `Issue.id`.

## Definition of Done (project-level)

- `docker compose up -d db` starts Postgres
- `npm run test:all` from repo root passes (api + web)
- Manual smoke: create project → create issue → comment → change status through full workflow
- Swagger documents all v1 endpoints
- README documents db, api, web startup
