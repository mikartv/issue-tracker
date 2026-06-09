# Issue 3 — Projects API

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/3

## Problem

**What exists:** DB schema without HTTP API (cycle 2).  
**What is expected:** CRUD-ish project endpoints with archive semantics.  
**Where they diverge:** Clients cannot manage projects.

## Source of truth

- `.cdd/SCOPE.md` — archive rules, no hard delete
- Swagger at `/api/docs` for this module

## Acceptance Criteria

- [ ] AC1: `POST /api/v1/projects` — body `{ name }` → 201, returns project
- [ ] AC2: `GET /api/v1/projects` — list all (include archived flag)
- [ ] AC3: `PATCH /api/v1/projects/:id` — rename `{ name }`; 404 if missing; 409 if archived
- [ ] AC4: `POST /api/v1/projects/:id/archive` — sets `archived=true`; 404 if missing; 409 if already archived (per SCOPE)
- [ ] AC5: Validation errors → 400 with STACK error shape
- [ ] AC6: Swagger documents all project routes
- [ ] AC7: Unit tests (service) + e2e tests (supertest + test DB) for happy path, archived rename rejection, and archive-again rejection (409)

## Non-goals

- Issues or comments endpoints
- Pagination
- Delete project

## Closure

All AC met; Swagger accurate; tests green on `cycle/3`.
