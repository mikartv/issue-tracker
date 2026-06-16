# RELEASE.md — issue-tracker v1.0.0

## Outcome

issue-tracker v1.0.0 — первый полный вертикальный срез: Projects API, Issues API, Comments API (NestJS) + Angular SPA (Angular Material). 109 тестов (76 api + 33 web). Реализована через 10 CDD-циклов.

## Why it matters

Базовый issue-tracker с DB-схемой, REST API и Angular UI демонстрирует полный цикл разработки под CDD: от пустого репозитория через итерационные alpha/beta-review раунды до закрытого релиза с артефактами в `.cdd/releases/1.0.0/`.

## Added

- **Projects API**: create, list, rename, archive
- **Issues API**: create, list-by-project, get, patch-fields, status-transitions (open→in_progress→done→closed)
- **Comments API**: create, list per issue
- **Angular SPA**: 3 views (ProjectsList, ProjectIssues, IssueDetail) с Angular Material styling
- **PostgreSQL 16** via Docker Compose + TypeORM migrations
- **Swagger API docs** at `/api/docs`
- **CI: GitHub Actions** (api job с Postgres service container + web job)
- **Documentation**: STACK.md (dev/prod runs), README.md (auth stub), SCOPE.md (DoD), PROJECT.md (map)

## Known Issues

- **Navigation**: Экраны между собой не связаны на уровне routerLink — доступны только через прямой ввод URL (Issue 11)
- **Status/Priority display**: Отображаются как raw enum-строки (`in_progress`, `critical`) без человекочитаемых меток
- **Error UX**: Ошибка submit (кроме 409 Conflict) скрывает весь контент страницы через `@else if (error)` условие
- **Empty state**: Нет сообщений при пустом списке проектов или задач
- **E2E automation**: `docs/SMOKE.md` — ручной checklist; автоматизированный supertest e2e spec отсутствует

## Validation

```bash
npm run test:all
# Output: 109 tests passed (76 api + 33 web), 0 failures

# Manual smoke test (clean clone):
npm install
npm run dev:db      # Start Postgres
npm run dev:api     # Start NestJS API (port 3333)
npm run dev:web     # Start Angular app (port 4200)
# Open http://localhost:4200/projects
# See docs/SMOKE.md for step-by-step manual checklist
```

---

**Artifact reference:** `.cdd/releases/1.0.0/` contains 10 cycle directories with gamma-scaffold, alpha-closeout, beta-review, gamma-closeout per cycle.
