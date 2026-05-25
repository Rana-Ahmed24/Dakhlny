# Dakhlny

Production-ready MVP for Dakhlny — a North Coast Egypt guest access coordination platform. Manual operator-based system — admins coordinate requests via phone and WhatsApp.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Radix primitives)
- Supabase

## Features

- **Landing page** — Premium coastal design with hero, villages, how it works, FAQ
- **Request Access** — Guest access request form
- **Become a Provider** — Provider application form
- **Admin Dashboard** — Operations panel with revenue, audit, and analytics
  - Access requests (filters, urgency, VIP, blacklist, revenue, smart provider assignment)
  - Provider applications (date-range availability, inline admin notes)
  - Providers (reliability, earnings, blacklist, availability dates)
  - Transaction logs and full audit trail

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the full script in `supabase/schema.sql`
3. If upgrading an existing database, also run `supabase/migrations/002_operational_upgrade.sql` then `supabase/fix-permissions.sql`
4. Copy your project URL and keys from **Settings → API**

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `ADMIN_PASSWORD` | Admin dashboard password |
| `ADMIN_SESSION_SECRET` | Random string, min 32 characters |
| `NEXT_PUBLIC_SITE_URL` | Optional, for metadata (e.g. `https://yourdomain.com`) |

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

`middleware.ts` protects `/admin/*` routes (except `/admin/login`).

## Project Structure

```
app/
  page.tsx                 # Landing
  request-access/          # Access request form
  become-provider/         # Provider application
  admin/                   # Admin dashboard + login
components/
  ui/                      # shadcn-style primitives
  layout/                  # Header, footer, shell
  landing/                 # Landing sections
  forms/                   # Public forms
  admin/                   # Dashboard tables
lib/
  actions/                 # Server actions
  auth/                    # Admin session
  supabase/                # Supabase clients
  constants.ts             # Villages, statuses
  types.ts                 # TypeScript types
supabase/
  schema.sql               # Database schema (new projects)
  migrations/              # Upgrade scripts for existing DBs
middleware.ts              # Admin route protection
```

## Security Notes

- Service role key is **never** exposed to the browser
- Public users can only **insert** requests/applications (RLS)
- Admin reads/writes use service role via server actions
- Admin auth uses signed HTTP-only cookies

## Business Rules

- No automated matching
- No customer–provider direct contact
- No payments, chat, or notifications in MVP
- Providers are internal-only (admin dashboard)
