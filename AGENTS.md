# AGENTS.md

## Repo state (read this first)

- Greenfield, spec-first. The only file is `docs/PRD.md` (v1.1, in Indonesian); there is no `package.json`, source tree, lockfile, CI, or git repository yet. `git` commands and `npm` scripts will fail until scaffolding exists.
- `docs/PRD.md` is the binding contract. Once code exists, executable config (`package.json`, Prisma schema, tests) outranks the PRD prose; when they diverge, fix the code or update the PRD, don't silently pick one.
- PRD changes must be logged in its §19 changelog; schema changes touching `order_items` or `rfm_snapshots` need an explicit rationale there.

## Commands (target contract, not yet runnable)

These are the commands the project is required to support (PRD §8, §14, §16.2, §20). Do not invent alternatives:

- `npm install && npm run build` must work from a clean clone.
- `npx prisma migrate deploy` must succeed against an empty database; schema lives in `prisma/schema.prisma`.
- `npm run seed` must be the single command that produces a dashboard-ready dataset (18 months).
- `npx tsc --noEmit` and ESLint must be clean; both are required in CI.
- Unit tests use Vitest and target `lib/rfm.ts` / `lib/cohort.ts`; run one file with `npx vitest run lib/rfm.test.ts`.
- Job trigger exists twice: admin "Recalculate now" and `/api/cron/rfm` (requires a secret header, 401 without it).

## Planned architecture (PRD §12)

- Next.js App Router + TypeScript, PostgreSQL 15+, Prisma, Auth.js v5 (credentials + JWT role), Tailwind + shadcn/ui, Recharts, custom CSS Grid heatmap (Recharts has no heatmap).
- Layout: `src/app/(shop)`, `src/app/(admin)/admin`, `src/app/api/cron/rfm/route.ts`, `src/components/{ui,charts}`, `src/lib/{auth,db,rfm,cohort,queries,validators}`, `scripts/{seed,rfm-job}.ts`, `prisma/`.
- `lib/rfm.ts` and `lib/cohort.ts` must stay pure (no DB access); all SQL lives in `lib/queries/*`.

## Invariants agents break most often

- **Revenue status list:** only `PAID`, `PROCESSING`, `SHIPPED`, `COMPLETED` count. `PENDING_PAYMENT`, `CANCELLED`, `REFUNDED` are excluded from every metric, query, and chart.
- **Snapshot immutability:** RFM results are upserted on unique `(period, user_id)`; a run for the current period must never modify past periods. Re-running the same period must not add rows.
- **Segment rule order is semantic, not cosmetic:** rules are evaluated top-down per PRD §10.2. `CANNOT_LOSE_THEM` must precede `LOYAL`, and `R=3,F=3` lands in `POTENTIAL_LOYALIST`, not `NEED_ATTENTION`. Lock this with tests.
- **Timezones:** store UTC; compute monthly buckets with `AT TIME ZONE 'Asia/Jakarta'`; render timestamps in WIB. Recency is day-diff from job run time, with a 365-day window for F and M.
- **History over master data:** `order_items` stores `product_name` and `unit_price` snapshots; products are soft-deleted (`deleted_at`), never `DELETE`d; price edits must not change old orders.
- **Checkout integrity:** stock decrement is an atomic guarded update inside the order transaction (`rowCount = 0` aborts); `orders.idempotency_key` is unique so double-clicks yield one order.
- **Authz is server-side:** authorize in the server action / route handler before zod validation. Middleware-only protection of `/admin` fails the milestone gate.

## Working constraints

- Milestone order is binding: M3 (seed) before M5 (analytics). Do not build charts before deterministic data exists. Every gate in PRD §16.2 must pass before starting the next milestone.
- UI copy is Indonesian; code, README, and docs are English.
- Seed is a core feature: fixed-seed PRNG (e.g. `SEED=42`), ~150 customers, 45–60 products, ~1.4–1.8k orders, and must satisfy ≥9/11 segments filled, ≥12 cohort rows, monotonic funnel, no segment >60%. Two `npm run seed` runs must produce identical datasets.
- Formatting: currency `Rp1.234.567` via `Intl` `id-ID`, percentages with one decimal.
- Config via env: `CLV_MARGIN` (default `0.3`) and the cron secret; payment is mocked, there is no guest checkout.
- Demo accounts come from seed: `admin@segmenta.test`, `customer@segmenta.test` (documented in README).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
