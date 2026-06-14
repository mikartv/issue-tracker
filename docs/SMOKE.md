# Smoke Checklist — issue-tracker

Operator-runnable manual checklist. Follow from a clean clone; no chat context required.

## Prerequisites

- Node.js 20 LTS, npm 10+, Docker installed and running
- Repository cloned; working directory: repo root

## Setup

```bash
cp .env.example .env
npm install
npm run dev:db                       # Starts Postgres 16 via Docker (port 5432)
npm run migration:run -w apps/api    # Run DB migrations (required before first API start)
npm run dev:api                      # Starts NestJS API via ts-node (port 3000)
```

Wait for the API to print `Application is running on: http://[::1]:3000` before continuing.

## Smoke path

Export placeholders once and reuse in subsequent steps:

```bash
export BASE=http://localhost:3000/api/v1
```

### Step 1 — Create a project

```bash
PROJECT=$(curl -sf -X POST "$BASE/projects" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke Project"}')
echo "$PROJECT" | jq .
PROJECT_ID=$(echo "$PROJECT" | jq -r .id)
```

Expected: HTTP 201. Response contains `id`, `name: "Smoke Project"`, `archived: false`.

### Step 2 — Create an issue on the project

```bash
ISSUE=$(curl -sf -X POST "$BASE/projects/$PROJECT_ID/issues" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Smoke issue","description":"Created during smoke","priority":"medium"}')
echo "$ISSUE" | jq .
ISSUE_ID=$(echo "$ISSUE" | jq -r .id)
```

Expected: HTTP 201. Response contains `status: "open"`, `project_id: "$PROJECT_ID"`.

### Step 3 — Add a comment to the issue

```bash
curl -sf -X POST "$BASE/issues/$ISSUE_ID/comments" \
  -H 'Content-Type: application/json' \
  -H 'X-User-Email: smoker@example.com' \
  -d '{"body":"Smoke comment"}' | jq .
```

Expected: HTTP 201. Response contains `author: "smoker@example.com"`, `body: "Smoke comment"`.

### Step 4 — Advance status: open → in_progress

```bash
curl -sf -X POST "$BASE/issues/$ISSUE_ID/status" \
  -H 'Content-Type: application/json' \
  -d '{"status":"in_progress"}' | jq .status
```

Expected: `"in_progress"`.

### Step 5 — Advance status: in_progress → done

```bash
curl -sf -X POST "$BASE/issues/$ISSUE_ID/status" \
  -H 'Content-Type: application/json' \
  -d '{"status":"done"}' | jq .status
```

Expected: `"done"`.

### Step 6 — Advance status: done → closed

```bash
curl -sf -X POST "$BASE/issues/$ISSUE_ID/status" \
  -H 'Content-Type: application/json' \
  -d '{"status":"closed"}' | jq .status
```

Expected: `"closed"`.

### Step 7 — Verify comment is retrievable

```bash
curl -sf "$BASE/issues/$ISSUE_ID/comments" | jq '.[0].body'
```

Expected: `"Smoke comment"`.

### Step 8 — Verify issue is in closed state

```bash
curl -sf "$BASE/issues/$ISSUE_ID" | jq .status
```

Expected: `"closed"`.

## Pass criteria

All 8 steps return the expected HTTP status codes and body values with no errors.

## Teardown (optional)

```bash
docker compose down   # stops and removes the Postgres container
```
