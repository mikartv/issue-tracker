# Issues Index

Per-cycle contracts live at `.cdd/issues/N/ISSUE.md`. γ MUST NOT dispatch α without a populated contract for that cycle. Dispatch prompts read the local file (see `.cdd/STACK.md` §CDD dispatch) — not `gh issue view`.

| ID | Title | Status | Mode | Branch | Contract |
|----|-------|--------|------|--------|----------|
| 0 | Bootstrap docs + README skeleton | open | design-and-build | cycle/0 | `.cdd/issues/0/ISSUE.md` |
| 1 | Monorepo scaffold + Docker + CI | closed | design-and-build | cycle/1 | `.cdd/issues/1/ISSUE.md` |
| 2 | DB schema + migrations | open | design-and-build | cycle/2 | `.cdd/issues/2/ISSUE.md` |
| 3 | Projects API | open | design-and-build | cycle/3 | `.cdd/issues/3/ISSUE.md` |
| 4 | Issues API + status rules | open | design-and-build | cycle/4 | `.cdd/issues/4/ISSUE.md` |
| 5 | Comments API | open | design-and-build | cycle/5 | `.cdd/issues/5/ISSUE.md` |
| 6 | Angular shell + API client | open | design-and-build | cycle/6 | `.cdd/issues/6/ISSUE.md` |
| 7 | Issue list + project views (Material) | open | design-and-build | cycle/7 | `.cdd/issues/7/ISSUE.md` |
| 8 | Issue detail + comments UI | open | design-and-build | cycle/8 | `.cdd/issues/8/ISSUE.md` |
| 9 | Create/edit issue flows | open | design-and-build | cycle/9 | `.cdd/issues/9/ISSUE.md` |
| 10 | Integration smoke + README polish | open | design-and-build | cycle/10 | `.cdd/issues/10/ISSUE.md` |

## Cycle notes (non-normative)

- **0:** Finalize SCOPE/STACK/ISSUES; README + PROJECT.md skeleton; STACK dispatch binding; no application code.
- **1:** `apps/api` health + `apps/web` placeholder + docker + CI + `X-User-Email` middleware stub.
- **2:** Entities: `projects`, `issues`, `comments`; no HTTP business routes yet.
- **3–5:** REST endpoints; each cycle adds Swagger decorators for its routes.
- **6:** Routing shell + typed API client; no Material yet.
- **7:** Angular Material for list views only.
- **10:** End-to-end manual smoke script or e2e test; README complete per SCOPE DoD.
