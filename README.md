# NEXORA AGENCY — Brand Identity Kit

## The Mark
A geometric N with a stepped shoulder: both stems share one baseline, the right stem rises above the cap line. Growth, forward movement and precision expressed through proportion alone — no arrows, no effects, no decoration. Draws from memory in four strokes; reads at 16 px.

## Typography
Montserrat SemiBold (NEXORA, +1.5% tracking) · Montserrat Medium (AGENCY, tracking justified to the wordmark width). Free via Google Fonts.

## Colour
- Primary — Nexora Black `#0A0A0A`
- Accent — Nexora Gold `#D4AF37` (flat, never gradient or metallic)
- Secondary — White `#FFFFFF`

Approved colourways: gold mark + black type (default), all-black, all-white, all-gold. Never mix other colours.

## Files
- `svg/` — master vectors (all variants; primary, horizontal, vertical, monogram, app icon, favicon, Instagram)
- `png/` — 2000 px transparent renders, app icon 1024, Instagram 1080, favicon 16/32/48/180 + favicon.ico
- `showcase/brand-sheet.html` — full identity presentation (open in a browser)

## Rules
Clear space: height of the N's stem width on all sides. Minimum size: 16 px (mark), 120 px wide (primary lockup). Never add shadows, gradients, outlines, effects, or rotation.

---

# Employee Management System

An internal, private back-office bolted onto the public NEXORA site. It lives entirely under `/employee/*` and `/admin/*`, is not linked from the public navbar, and does not touch the public pages, layout, or styling. Backend is 100% Supabase (Postgres + Auth + Row Level Security) — no custom server.

## 1. Install

```bash
npm install
```

## 2. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New project. Note your **Project URL** and **anon public key** (Project Settings → API).

## 3. Create the database

Open your project's **SQL Editor** and run, in order:

1. `supabase/schema.sql` — creates every table, index, trigger, RLS policy, and helper function. Safe to re-run.
2. `supabase/seed.sql` *(optional)* — inserts a handful of demo service rows (clearly marked as demo data; no employees/auth accounts are created by it). Skip it if you'd rather add your real services from **Admin → Settings**.

## 4. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Only the **anon** key ever goes in frontend env vars. The `service_role` key must never appear here or anywhere in the frontend — see step 6.

## 5. Create the first admin (one-time, manual)

The in-app "Add Employee" flow only ever creates **employee** accounts (by design — see Security below). The very first admin has to be created once, directly against Supabase:

1. Supabase Dashboard → **Authentication → Users → Add user** → enter the admin's email + a password → create.
2. Supabase Dashboard → **SQL Editor**, run:
   ```sql
   insert into public.profiles (auth_user_id, full_name, email, role, active)
   values ('<paste the new user's UUID from the Users list>', 'Admin Name', 'admin@nexora-agency.tech', 'admin', true);
   ```
3. Sign in at `/admin/login` with that email/password.

Every admin created after that can be promoted the same way, or you can add a "promote to admin" step yourself in the SQL editor — the app's UI intentionally never lets anyone change a `role` column (RLS blocks it from the client entirely).

## 6. Deploy the Edge Function (admin → create employee)

Creating an employee's login needs Supabase's Admin API, which requires the `service_role` key. That key is never shipped to the browser — instead it lives only inside a small Supabase Edge Function.

```bash
# once, if you haven't already:
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF

# deploy the function:
supabase functions deploy admin-users
```

The function reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase's own function secrets (set automatically for you by the platform for `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` — no manual secret configuration needed on Supabase's hosted platform). Once deployed, **Admin → Employees → Add Employee** works end-to-end from the UI.

## 7. Create employees

Sign in as admin → **Employees → Add Employee** → fill in name/email/a temporary password → Create. Share the email + temporary password with the employee directly (e.g. in person or a secure channel) — the account is created with the email pre-confirmed, so they can sign in at `/employee/login` immediately with those credentials.

## 8. How authentication works

- Supabase Auth issues a session (JWT) on sign-in; `src/features/auth/AuthContext.tsx` holds it in React context for the whole app.
- Every `profiles` row has `role` (`admin` | `employee`) and `active`. On every login/session restore, the app loads the caller's own profile; if `active = false`, it is immediately signed out.
- `src/features/auth/RequireRole.tsx` guards `/employee/*` and `/admin/*` routes: no session → redirect to the matching login page; wrong role → redirect to your own dashboard. **This is a UX convenience only.** The real enforcement is RLS (next section) — a logged-in employee's API/database calls are restricted by Postgres itself, not by anything the frontend chooses to render.

## 9. How RLS works

Every table has Row Level Security enabled with no default access — each policy is additive. In short:

- **profiles** — everyone can read their own row (or all rows, if admin). Nobody but an admin can write to `profiles` at all — an employee cannot change their own role, active flag, or anyone else's data, even by calling the API directly.
- **services** — employees see active services only (needed to build quotations); only admins can create/edit/deactivate them.
- **quotations / quotation_items** — an employee can only see and create their own; they can edit their own quotation while it's still `DRAFT`. Admins see and manage everything.
- **contracts / contract_items** — same visibility rule. An employee can edit their own contract only while it is `PENDING`, and cannot move it to `CONFIRMED`/`PAID`/`CANCELLED` themselves — those transitions (the ones that count toward sales/ranking) are admin-only, so performance numbers can't be self-certified.
- **employee_targets** — an employee can read their own target but never set it; only admins can.
- Two Postgres helper functions (`is_admin()`, `current_profile_id()`) back every policy, and a third (`get_my_performance`) lets an employee learn their own rank among all employees without ever being able to query another employee's raw contract data — it computes over everyone internally but returns only the caller's own row.

Try it yourself: sign in as employee A, note a quotation ID belonging to employee B, and attempt to fetch it via the Supabase client in a browser console — it comes back empty, not an error, because RLS filters the row out entirely.

## 10. Run locally

```bash
npm run dev
```

## 11. Build

```bash
npm run build
```

## 12. Deploy

The app is a static Vite build — deploy `dist/` anywhere that serves static files (Netlify, Vercel, etc.), with `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` set as build-time environment variables on the host. No server process is required. Because this is a client-side router, configure your host to rewrite all paths to `/index.html` (a SPA fallback) so deep links like `/employee/dashboard` work on refresh.

## Data model

`profiles`, `employee_targets`, `services`, `quotations` → `quotation_items`, `contracts` → `contract_items`. Quotation/contract line items snapshot the service's `name` and `price` at the moment they're added — a later price change in **Admin → Settings** never rewrites historical quotations or contracts.

## Limitations

- The Edge Function must be deployed by you via the Supabase CLI (step 6) — it can't be deployed from this environment since it requires your Supabase project credentials/login.
- The first admin account is a one-time manual step (step 5) — the app itself never creates admin accounts, only employee accounts, so that a compromised employee session can never mint itself a new admin.
- Password reset is email-based (`supabase.auth.resetPasswordForEmail`), so your Supabase project needs a working email provider configured (Supabase's default works for testing; configure a custom SMTP provider for production volume).
