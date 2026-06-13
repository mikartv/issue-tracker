---
cycle: 5
issue: "#5 — Comments API"
mode: design-and-build
role: α
---

# Self-Coherence — Cycle 5

## §Gap

**Issue:** #5 — Comments API  
**Mode:** design-and-build  
**Gap:** Issues API exists (cycle 4) but there is no discussion thread on issues. This cycle adds POST + GET comment routes under `/api/v1/issues/:issueId/comments`, with author sourced from the global `UserEmailMiddleware` / `req.userEmail` pattern.  
**Non-goals (carried in):** Edit/delete comment; markdown rendering; @mentions.
