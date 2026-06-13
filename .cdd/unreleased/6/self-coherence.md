---
cycle: 6
role: α
issue: "#6 — Angular shell + API client"
mode: design-and-build
---

# Self-coherence — Cycle 6

## §Gap

**Issue:** #6 — Angular shell + API client  
**Mode:** design-and-build (small-change band: 6 ACs, single-app scope, no new infrastructure)  
**Version:** cycle/6 branch  

**Gap framing:** Angular SPA shell existed as a bare scaffold (empty routes, no HttpClient, no API service) after cycle 1. Cycles 2–5 built the complete NestJS API. Cycle 6 bridges them: routing, typed HTTP client, placeholder feature components, dev connectivity.

---

## §Skills

**Tier 1 (CDD lifecycle):**
- `cnos.cdd/skills/cdd/alpha/SKILL.md` — α role contract (loaded, governs this work)
- `CDD.md` — canonical lifecycle

**Tier 2 (engineering):**
- TypeScript strict mode (`strict: true` in `apps/web/tsconfig.json`) — no `any`, no `as unknown as X` casts
- Angular 17 standalone component conventions, new `@if`/`@else` control flow syntax
- `@angular/common/http` — `HttpClient`, `provideHttpClient`, `provideHttpClientTesting`

**Tier 3 (issue-specific):**
- Angular 17 routing: `provideRouter`, `Routes`, `RouterOutlet`
- Jest + `jest-preset-angular` test harness (existing setup preserved)
- NestJS CORS: `app.enableCors()` (single-call API surface)
