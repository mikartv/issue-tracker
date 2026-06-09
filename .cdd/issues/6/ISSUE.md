# Issue 6 — Angular shell + API client

**Mode:** design-and-build  
**Status:** open  
**Branch:** cycle/6

## Problem

**What exists:** Complete API (cycles 3–5); Angular placeholder only (cycle 1).  
**What is expected:** Routed SPA shell and typed HTTP client calling the API.  
**Where they diverge:** No navigation or API integration in web.

## Source of truth

- `.cdd/STACK.md` — routes, environments, no Material yet

## Acceptance Criteria

- [ ] AC1: Routes configured: `/projects`, `/projects/:projectId/issues`, `/issues/:issueId` (placeholder components ok)
- [ ] AC2: Shared `ApiService` or feature services using `HttpClient` + `environment.apiUrl`
- [ ] AC3: Dev proxy or CORS configured so local web can call api (document choice in README)
- [ ] AC4: Placeholder pages show loading/error states (minimal)
- [ ] AC5: Unit tests for API service (mock HttpClient)
- [ ] AC6: No Angular Material imports yet

## Non-goals

- Full UI for lists/detail/forms (cycles 7–9)
- Auth UI for email header (optional dev note in README ok)

## Closure

`npm run dev:web` + `dev:api` — navigation works; tests green on `cycle/6`.
