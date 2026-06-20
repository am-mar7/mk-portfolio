# Plan: Admin Dashboard + Dynamic Projects (Supabase)

> Status: **Draft for review.** Nothing has been executed yet.
> Goal: Let the portfolio owner add/delete projects via an admin dashboard, move
> projects from a static array into Supabase, make the public UI scale as projects
> grow, and give the owner layout-control options per project.

---

## Current state (findings)

- Projects are a hardcoded array in `lib/data.ts`, consumed by `components/Work.tsx`.
- Each project has: `title`, `type`, `colSpan`, `aspect`, `gradient`, `embedUrl`, `thumbnailUrl`, `vertical`.
- `Work.tsx` splits projects into vertical (grid `cols-4`) and horizontal (grid `cols-2`) groups.
  This layout is hardcoded and will not scale gracefully as the project count grows.
- Supabase is **not** wired yet (no `@supabase/*` deps, no `.env`, no client).
- Stack: Next.js 16 (App Router), React 19, Tailwind v4, framer-motion.

---

## Phase 0 — Decisions (CONFIRMED)

1. **Auth approach — CONFIRMED**: No Supabase Auth, no NextAuth. Use **hardcoded credentials**
   (admin email + password) stored in `.env.local`. There is **no login button**: when the admin
   navigates to `/admin`, they are prompted for email + password; the values are compared on the
   **server** against the env values. On match, set a signed **httpOnly session cookie**; middleware
   then guards `/admin` routes by checking that cookie.
   - Credentials are compared server-side only (never shipped to the client).
   - Password should be compared using a constant-time comparison.
2. **Thumbnails — CONFIRMED**: Keep current model — derive thumbnail automatically from the
   YouTube video ID, with an *optional* override field for a custom thumbnail URL.
3. **Public data fetch — CONFIRMED**: Render projects on the public site via a
   **Server Component** reading from Supabase, with revalidation.

---

## Phase 1 — Dependencies & environment

- Add `@supabase/supabase-js` (no `@supabase/ssr` needed — we are not using Supabase Auth).
- Create `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL` — public, for client/server reads
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key (read published projects)
  - `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, used for admin writes (bypasses RLS)
  - `ADMIN_EMAIL` — **server-only**, hardcoded admin email
  - `ADMIN_PASSWORD` — **server-only**, hardcoded admin password
  - `ADMIN_SESSION_SECRET` — **server-only**, secret used to sign the session cookie
- Ensure `.env.local` is in `.gitignore`.
- Update `next.config.ts` `images.remotePatterns` to allow `img.youtube.com`
  (and the Supabase Storage host if used later).

---

## Phase 2 — Database (SQL)

Create a `projects` table plus layout columns and Row Level Security.

```sql
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  type          text not null,              -- e.g. "Product Ad"
  embed_url     text not null,              -- YouTube embed URL
  thumbnail_url text,                       -- optional override; else derived from embed
  -- layout controls:
  orientation   text not null default 'vertical',  -- 'vertical' | 'horizontal'
  size          text not null default 'medium',    -- 'small' | 'medium' | 'large' | 'full'
  gradient      text,                       -- optional tailwind gradient classes
  featured      boolean not null default false,
  sort_order    integer not null default 0, -- manual ordering
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Public (anon key) can read only published projects
create policy "public read published"
  on public.projects for select
  using (published = true);

-- No insert/update/delete policies for anon: admin writes use the
-- service role key (server-only), which bypasses RLS entirely.
```

> Note: Because we are NOT using Supabase Auth, admin create/update/delete run on the server
> with the **service role key**. The anon key only ever sees published projects.

- Also provide a **seed script** to migrate the existing 6 projects into the table.

---

## Phase 3 — Supabase client + auth wiring

- `lib/supabase/server.ts` — server clients:
  - public client (anon key) for reads
  - admin client (service role key) for writes — server-only
- `lib/auth.ts` — credential check against `ADMIN_EMAIL`/`ADMIN_PASSWORD` (constant-time compare),
  signed session cookie create/verify using `ADMIN_SESSION_SECRET`.
- `middleware.ts` — guards `/admin` routes: if no valid session cookie, redirect to the
  email/password prompt.
- `lib/projects.ts` — typed `Project` type + data-access functions:
  - `getPublishedProjects()` (anon)
  - `getAllProjects()` (admin)
  - `createProject()` (admin)
  - `updateProject()` (admin)
  - `deleteProject()` (admin)

---

## Phase 4 — Refactor public UI to scale

- Update `components/Work.tsx` to read from Supabase instead of the static array.
- Replace the hardcoded vertical/horizontal split with a **flexible responsive grid**
  driven by each project's `size` + `orientation`, ordered by `sort_order`.
  Handles any number of projects (wraps cleanly, no broken rows).
- Add a **"Load more" / show-limited** behavior (e.g. show first N, expand) so a large
  project count doesn't make the page huge.
- Keep `lib/data.ts` for the static content (services, testimonials, etc.);
  only projects move to the DB.

---

## Phase 5 — Admin dashboard (`/admin`)

- Access prompt — when an unauthenticated visitor hits `/admin`, they are shown an
  **email + password prompt** (no separate login button/flow). Submitting posts to a
  server action that compares against the env credentials and, on success, sets the
  signed session cookie and reveals the dashboard.
- `/admin` — protected dashboard:
  - List all projects (published + drafts).
  - **Add** project (form: title, type, YouTube URL, orientation, size, gradient,
    featured, published, sort order).
  - **Edit** project.
  - **Delete** project (with confirm).
  - Reorder via `sort_order` (simple number field first; drag-and-drop optional later).
  - Live preview of how the card will look.
- Server Actions for mutations (revalidate the public page after changes).

---

## Phase 6 — Polish & verify

- Loading/empty/error states on both public and admin.
- `npm run build` + `npm run lint` to verify.
- Short README section documenting env vars + how to run the SQL.

---

## Layout-control options the owner will get

Per project, from the dashboard:

- **Orientation**: vertical (9:16) or horizontal (16:9)
- **Size**: small / medium / large / full-width
- **Featured**: emphasize a project
- **Order**: manual `sort_order`
- **Gradient/accent**: optional color overlay
- **Published**: show/hide without deleting

---

## Open questions before execution

1. Auth — **RESOLVED**: hardcoded email + password in `.env.local`, server-side compare,
   signed session cookie, middleware-guarded `/admin`.
2. Thumbnails — **RESOLVED**: auto from YouTube + optional override.
3. Public data fetch — **RESOLVED**: Server Component.
4. Still open: include the **seed migration** of the existing 6 projects into the new table? (recommended: yes)

---

## Review notes

<!-- Add your comments below this line. -->
