# Segmenta

E-commerce storefront with an admin panel that segments customers automatically using **RFM (Recency, Frequency, Monetary)** analysis, then tracks how those segments move over time.

This is a portfolio project. The product contract lives in [`docs/PRD.md`](docs/PRD.md) (Indonesian); the build order and the gates that must pass are in PRD §16.

## Status

**M1 — Foundation & tooling (in progress).** The shell, design system, formatting utilities, and CI exist. Catalog, checkout, seed data, and analytics land in later milestones; `/admin` is intentionally closed in production builds until the auth layer ships.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma (added in M1 Fase B) |
| Auth | Auth.js v5, credentials + JWT role (added in M1 Fase B) |
| Charts | Recharts + custom CSS Grid heatmap (M5) |
| Tests | Vitest |

## Requirements

- Node.js >= 22
- npm 10+

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
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

Database and seed scripts (`npm run seed`, `prisma migrate`) are added in M1 Fase B and M3.

## Project structure

```
src/
  app/
    (shop)/          storefront routes
    (admin)/admin/   admin panel routes
  components/
    ui/              shadcn/ui primitives
  lib/
    format.ts        currency / percent / WIB date formatting
    segments.ts      the 11 RFM segments, labels, and colors
docs/PRD.md          product requirements (binding contract)
```

## Conventions

- UI copy is Indonesian; code, comments, and this README are English.
- Currency renders as `Rp1.234.567`; percentages use one decimal.
- Timestamps are stored in UTC and rendered in `Asia/Jakarta`.
- Revenue only counts orders in `PAID`, `PROCESSING`, `SHIPPED`, or `COMPLETED`.

## Demo accounts

Created by the seed script (M3):

- `admin@segmenta.test`
- `customer@segmenta.test`

Passwords are documented once the seed exists. All customer data is synthetic.
