# Segmenta

E-commerce storefront with an admin panel that segments customers automatically using **RFM (Recency, Frequency, Monetary)** analysis, then tracks how those segments move over time.

This is a portfolio project. The product contract lives in [`docs/PRD.md`](docs/PRD.md) (Indonesian); the build order and the gates that must pass are in PRD §16.

## Status

**M1 — Foundation & tooling (in progress).** Fase A (shell, design system, formatting utilities, CI) and Fase B (Prisma schema, Auth.js credentials, server-side admin guard) are done. Catalog, checkout, seed data, and analytics land in later milestones; `/admin` now requires an `ADMIN` session and returns `403` for customers.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL 15+ (Supabase) |
| ORM | Prisma 7 (`prisma-client` generator + `@prisma/adapter-pg`) |
| Auth | Auth.js v5 (credentials, JWT session with role) |
| Charts | Recharts + custom CSS Grid heatmap (M5) |
| Tests | Vitest |

## Requirements

- Node.js >= 22
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env       # then fill in the values
npx prisma migrate deploy  # apply the schema
npm run seed:auth          # create the demo accounts
npm run dev
```

The app runs at http://localhost:3000.

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase **transaction pooler** URL (port 6543, `pgbouncer=true`) used at runtime |
| `DIRECT_URL` | Supabase **session pooler** URL (port 5432) used by Prisma Migrate |
| `AUTH_SECRET` | Auth.js session secret (`npx auth secret`) |
| `AUTH_TRUST_HOST` | Set to `true` when running behind a proxy such as Vercel |
| `CRON_SECRET` | Shared secret for `POST /api/cron/rfm` |
| `CLV_MARGIN` | Margin assumption for the CLV estimate (default `0.3`) |

Supabase's direct host (`db.<ref>.supabase.co`) resolves to IPv6 only. Use the pooler URLs from **Dashboard → Connect → ORM → Prisma** so the app works on IPv4-only networks.

Prisma 7 reads its datasource URL from [`prisma.config.ts`](prisma.config.ts), not from `schema.prisma`. Migrations use `DIRECT_URL`; the runtime client (`src/lib/db.ts`) uses `DATABASE_URL` through the `pg` driver adapter.

The Prisma client initializes lazily on the first query, so `npm run build` does not need a database connection or `DATABASE_URL`. Missing environment variables fail at request time with an explicit message, not during the build.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run db:deploy` | Apply committed migrations (`prisma migrate deploy`) |
| `npm run db:migrate` | Create a migration in development (`prisma migrate dev`) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed:auth` | Seed the demo accounts (M1) |

`npm run seed` — the full 18-month dashboard dataset — arrives in M3.

## Project structure

```
prisma/
  schema.prisma      data model (PRD §11)
  migrations/        committed SQL migrations
scripts/
  seed-auth.ts       demo accounts (M1); full seed lands in M3
src/
  app/
    (shop)/          storefront routes
    (admin)/admin/   admin panel routes
    api/auth/        Auth.js route handler
  components/
    ui/              shadcn/ui primitives
  lib/
    actions/         server actions (auth)
    auth-guards.ts   requireUser / requireAdmin (server-side authorization)
    db.ts            Prisma client singleton (driver adapter)
    format.ts        currency / percent / WIB date formatting
    segments.ts      the 11 RFM segments, labels, and colors
    validators/      zod schemas
  proxy.ts           cookie-presence redirect for /admin (UX only)
docs/PRD.md          product requirements (binding contract)
```

Authorization is enforced in server components, server actions, and route handlers via `requireAdmin()`. `src/proxy.ts` only redirects anonymous visitors early; it is not the security boundary.

## Conventions

- UI copy is Indonesian; code, comments, and this README are English.
- Currency renders as `Rp1.234.567`; percentages use one decimal.
- Timestamps are stored in UTC and rendered in `Asia/Jakarta`.
- Revenue only counts orders in `PAID`, `PROCESSING`, `SHIPPED`, or `COMPLETED`.

## Demo accounts

Created by `npm run seed:auth`. Password for all three is `Segmenta123!`.

- `admin@segmenta.test` — ADMIN
- `customer@segmenta.test` — CUSTOMER
- `budi@segmenta.test` — CUSTOMER

All customer data is synthetic.
