# Berlinkoueni — theghostshell

A database-driven personal portfolio for Berlinkoueni (theghostshell), based in Douala, Cameroon.
Built with Next.js App Router, Prisma + PostgreSQL, NextAuth, Zod, and React.

Profile, contact details, social links, skills, projects, and articles can be managed from the admin dashboard.
The seed intentionally does not create invented projects, articles, skills, or social accounts.

---

## Quick start

Use Node.js 20.19+ or 22.12+.

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PATH
#   → generate secrets with: openssl rand -base64 32

# 3. Create the database schema
npx prisma db push        # or: npm run db:migrate

# 4. Create the admin account and personal profile
npm run db:seed

# 5. Run
npm run dev               # http://localhost:3000
```

Admin panel: **http://localhost:3000{ADMIN_PATH}**. Use a unique, long random `ADMIN_PATH` and the `ADMIN_EMAIL` / `ADMIN_PASSWORD` credentials from `.env`. The example password is intentionally blank; the seed refuses to run without an administrator password of at least 16 characters.

---

## Architecture

```
prisma/schema.prisma        # Profile, SocialLink, Project, Skill, Article, Message, User, PageView
prisma/seed.ts              # admin user + real profile defaults (no fake portfolio content)
src/
  auth.ts                   # NextAuth v4 credentials provider (bcrypt)
  middleware.ts             # auth + rewrite of the configurable ADMIN_PATH onto internal /admin routes
  lib/
    db.ts                   # Prisma singleton
    queries.ts              # cached public reads (request-deduped)
    validators.ts           # Zod schemas for every form
    rate-limit.ts           # PostgreSQL-backed contact and admin-login limits
    actions/
      public.ts             # submitContactMessage (honeypot + rate limit)
      admin.ts              # all admin mutations (profile, links, projects, skills, articles, inbox)
    utils.ts                # slugify, parseTags, cn, formatDate
  app/
    page.tsx                # / — DB-driven hero + featured projects
    about/                  # /about — long bio + skills by category
    projects/               # /projects + /projects/[slug]
    blog/                   # /blog + /blog/[slug] (markdown via react-markdown + remark-gfm)
    contact/                # /contact — stores messages in DB
    admin/
      login/                # credentials sign-in
      (dashboard)/          # protected: dashboard, settings, projects, skills, blog, messages
  components/               # header, footer, project card, markdown, motion primitives
tests/                      # vitest unit tests (validators, utils, rate limit)
```

### Data flow (why the site updates instantly)

```
Admin form → Zod validation (client + server) → Server Action → Prisma write
           → revalidatePath("/") etc. → next visitor render reads fresh rows via queries.ts
```

---

## Security model

- **Route protection:** `src/middleware.ts` checks the NextAuth JWT cookie for every request under your configured `ADMIN_PATH` (default `/admin`, see `.env.example`).
- **Password:** bcrypt (cost 12), never stored or logged in clear.
- **Validation:** every mutation re-validated server-side with Zod — client validation is UX only.
- **Abuse protection:** contact submissions are limited to 5 per IP every 10 minutes; administrator sign-ins are limited by account and IP. Shared PostgreSQL buckets store only HMAC digests, not raw IP addresses.
- **Secrets:** only in `.env` (gitignored). `NEXTAUTH_SECRET` via `openssl rand -base64 32`.

---

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:seed` | Create admin + personal profile defaults |
| `npm run db:studio` | Browse data in Prisma Studio |

---

## Notes

- All pages are `force-dynamic` by design: content is DB-driven and admin edits appear immediately.
- Skills levels render as hairline meters on `/about`; categories group the grid.
- Markdown is rendered server-side with `react-markdown` + `remark-gfm` and styled by `.prose-dark`.
- Abuse limits are stored in PostgreSQL and shared across serverless instances. Apply the current Prisma schema before deploying schema changes.
- Views counters (projects/articles) use fire-and-forget increments on public detail pages.

---

## Deploying to Vercel + Neon

The app is 100% compatible with Vercel (Next.js native) + Neon serverless Postgres (free tier).

### 1. Push the code to GitHub

The `portfolio/` folder must be the **deploy root**. Two options:

- **Option A (recommended):** make `portfolio/` its own git repository and push it.
- **Option B:** keep the monorepo and set **Root Directory = `portfolio`** in Vercel's project settings.

`.env` is gitignored — never commit it; env vars are configured in the Vercel dashboard.

### 2. Create the Neon database

1. Sign up at [neon.tech](https://neon.tech) (free tier is enough) → **Create project**.
2. Copy **both** connection strings from the dashboard (enable *Connection pooling*):
   - **Pooled** string → `DATABASE_URL` (runtime queries)
   - **Direct** string (non-pooled) → `DIRECT_URL` (migrations)
3. Put them in `.env` and run `npx prisma db push` to create/update the schema before deploying code that depends on schema changes. Set a unique admin password, `NEXTAUTH_SECRET`, and a long random `ADMIN_PATH`, then run `npm run db:seed` once.

### 3. Create the Vercel project

1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. **Root Directory:** `portfolio` (only for option B monorepo).
3. **Build command** stays `npm run build` — it already runs `prisma generate && next build`.
4. Add the environment variables (Production + Preview):

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon **pooled** string |
   | `DIRECT_URL` | Neon **direct** string |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` (or custom domain) |
   | `NEXTAUTH_SECRET` | Unique output of `openssl rand -base64 32` |
   | `ADMIN_PATH` | A unique path, e.g. `/panel-` + 32 random hex characters |
   | `ADMIN_EMAIL` | `berlinkoueni25@gmail.com` (or another admin address you control) |
   | `ADMIN_PASSWORD` | Unique password of at least 16 characters (seed only) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_SITE_NAME` | your site name |

### 4. Initialize the production database

After the first deploy, run once from your machine:

```bash
# .env pointed at Neon, with all required secrets set
npx prisma db push
npm run db:seed
```

The seed is idempotent and does not add sample content. Re-running it updates the configured admin password and resets the profile's identity, contact details, and starter biography to the values above.
If this database was previously seeded with demo data, remove the example projects, articles, skills, and social links from the admin dashboard before publishing; the new seed does not delete existing data.

### 5. Verify

- Public site: `https://your-app.vercel.app`
- Admin: `https://your-app.vercel.app{ADMIN_PATH}` — `/admin` renders a 404.
- Confirm `NEXT_PUBLIC_SITE_URL` and `NEXTAUTH_URL` both use the same final HTTPS origin before the production build; the former feeds site metadata, `robots.txt`, and `sitemap.xml`.
- Visit `/robots.txt` and `/sitemap.xml`, then submit a contact message and confirm it arrives in the admin inbox.
- Do not reuse the production database or credentials for Preview deployments. Use separate Preview secrets and a separate database.
- Use a strong, unique `NEXTAUTH_SECRET` and administrator password; restrict access to the production environment variables and database.

### Going further

- **Custom domain:** Vercel → Settings → Domains, then update `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL`.
- **Migrations:** use `prisma migrate dev` locally and `prisma migrate deploy` on Neon for production. The current project has no committed Prisma migration history; establish and review a baseline before switching a live database away from `prisma db push`.
- **Pre-launch smoke test:** after configuring a reachable database and deploying, verify `/`, `/about`, `/projects`, `/blog`, `/contact`, submit a test contact message, and verify the configured admin URL rejects unauthenticated access.
