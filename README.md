# Berlin Koueni — BerlinKoueni.tech

A database-driven personal portfolio for Berlin Koueni (theghostshell), based in Douala, Cameroon.
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

# 3. Create/update the database schema
npm run db:push            # run once for a new local/production database

# 4. Create the admin account and personal profile
npm run db:seed

# 5. Run
npm run dev               # http://localhost:3000
```

Admin panel: **http://localhost:3000{ADMIN_PATH}**. Use a unique, long random `ADMIN_PATH` and the `ADMIN_EMAIL` / `ADMIN_PASSWORD` credentials from `.env`. The example password is intentionally blank; the seed refuses to run without an administrator password of at least 16 characters.

`npm run db:seed` invokes Prisma's seed command so Prisma loads the root `.env`. Set `DATABASE_URL` and `DIRECT_URL` to the intended database, and `ADMIN_EMAIL`/`ADMIN_PASSWORD` to the credentials you want, before running it. The seed updates the stored password hash and also resets the supplied profile, projects and skills; run it once for a new production database, not after editing your profile.

---

## Architecture

```
prisma/schema.prisma        # Profile, SocialLink, Project, Skill, Article, Message, User, PageView
prisma/seed.ts              # admin user + supplied profile, projects, skills and social links
src/
  auth.ts                   # NextAuth v4 credentials provider (bcrypt)
  middleware.ts             # auth + rewrite of the configurable ADMIN_PATH onto internal /admin routes
  lib/
    db.ts                   # Prisma singleton
    queries.ts              # cached public reads (5-minute data cache + request deduplication)
    validators.ts           # Zod schemas for every form
    rate-limit.ts           # PostgreSQL-backed contact and admin-login limits
    admin-auth.ts           # independent session/account check for every admin mutation
    form-data.ts            # native-checkbox and serialized-boolean parsing
    actions/
      public.ts             # submitContactMessage (honeypot + rate limit)
      admin.ts              # all admin mutations (profile, links, projects, skills, articles, inbox)
    utils.ts                # slugify, parseTags, cn, formatDate
  app/
    page.tsx                # / — DB-driven hero + featured projects (latest published fallback)
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
Admin form → Zod validation (client + server) → authenticated Server Action → Prisma write
           → revalidateTag("portfolio-public") + revalidatePath("/", "layout")
           → next visitor render reads fresh rows via queries.ts
```

---

## Security model

- **Route protection:** `src/middleware.ts` checks the NextAuth JWT cookie for every request under your configured `ADMIN_PATH` (default `/admin`, see `.env.example`).
- **Mutation protection:** every admin Server Action verifies the session and confirms the administrator account still exists before reading or writing content.
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
| `npm run db:seed` | Seed the supplied profile, projects, skills and social links |
| `npm run db:studio` | Browse data in Prisma Studio |

---

## Notes

- Public database reads use a five-minute Next.js Data Cache, invalidated after admin edits. Pages render at request time using `connection()`, so production builds do not require a reachable database. Admin reads and private previews bypass the public cache.
- Skills levels render as hairline meters on `/about`; categories expand as native, keyboard-accessible disclosures.
- Home shows up to three published featured projects. If none are featured, it shows the three latest published projects. Draft projects remain private.
- Project and gallery images use Next.js optimization for trusted local, GetSmarter and Cloudinary URLs. Other admin-provided URLs keep working through the browser without image optimization.
- Markdown is rendered server-side with `react-markdown` + `remark-gfm` and styled by `.prose-dark`.
- Abuse limits are stored in PostgreSQL and shared across serverless instances. Apply the current Prisma schema before deploying schema changes.
- View counters use a separate browser request to `/api/views`, limited to one increment per IP/content item every 30 minutes. Rendering or prefetching a page no longer writes to the database. Public counters may lag by up to five minutes; admin counters read fresh values.

---

## Project stories, previews and integrations

Projects have optional **Challenge**, **Approach**, **Outcome** and **Screenshots** fields. Each screenshot is an HTTP(S) image URL, with up to six images per project. These fields are stored with the existing markdown content in a versioned metadata header; older markdown remains readable and no new database tables or columns are required. Use the editor for changes so this metadata is preserved.

After saving a project or article, use **Preview saved version** to open its private preview. Preview routes require a valid administrator session and are marked `noindex`. Public pages, sitemap entries and sharing images continue to exclude drafts. New items redirect to their editor after saving, so a saved draft can be previewed immediately.

### Image uploads

Create a [Cloudinary](https://cloudinary.com/documentation/image_upload_api_reference) product environment and add its credentials to your local `.env` and Vercel environment variables:

```dotenv
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

The upload control supports project images, screenshots, article covers and avatars. It accepts JPEG, PNG, WebP and AVIF files up to 4 MB. Uploads require an admin session, validate the file signature, and send credentials only from the server. Images are stored in Cloudinary's `portfolio` folder. Save the editor after uploading to attach the image to your content. Without credentials, you can still paste an external image URL.

### Contact notifications

Create a [Resend](https://resend.com/docs/api-reference/emails/send-email) API key and verify the domain used for your sender address. Configure:

```dotenv
RESEND_API_KEY="your-resend-api-key"
CONTACT_NOTIFICATION_FROM="Portfolio <notifications@your-verified-domain.com>"
CONTACT_NOTIFICATION_TO="your-inbox@example.com"
```

Notifications go only to the configured owner address, with the visitor's email as `Reply-To`. Messages are saved to the admin inbox before delivery is attempted. Provider timeouts or failures leave the message in the inbox and do not report a failed submission to the visitor. Failures are logged without message contents or API credentials. These notifications do not include a background retry queue; check the admin inbox if delivery fails.

The **Connected services** section of admin settings shows whether each integration is configured. Keep all keys server-side; none should use a `NEXT_PUBLIC_` prefix. Restart the local server or redeploy after changing environment variables.

### Sharing and search

Every public page has language-specific `/fr` and `/en` URLs, canonical and `hreflang` metadata, and Open Graph/Twitter metadata. Unprefixed routes select a language from the saved preference or browser language. `/api/og` generates a 1200 × 630 PNG for the portfolio or a published project/article. Project pages include `CreativeWork` structured data; article pages include `BlogPosting` data. The sitemap lists both language variants with alternates. Keep `NEXT_PUBLIC_SITE_URL` set to the final public HTTPS origin.

### Recruiter profile and memories

The homepage shows the CV link only when a PDF URL is entered in **Admin → Settings → Profile**; the same link appears on About. GitHub is surfaced alongside it when configured. Memories remain editable in the admin panel, including captions, dates, source attribution and gallery images. The supplied GetSmarter Hacking Challenge memory retains its publicly sourced image and credit; no unsupplied CV or event photos are fabricated.

### Articles connected to project work

The articles seed appends a short bilingual section connecting each technical topic to a documented project in the portfolio. It creates missing records and upgrades only the original untouched seed copy, preserving content edits made in the admin panel. Re-run `npm run db:articles` after changing the article seed.

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
3. Set the **Build Command** to `npm run vercel-build`. It generates Prisma Client, applies the Prisma schema with `prisma db push`, then builds Next.js. A schema/database error fails the deployment instead of publishing code that cannot use its database.
4. Add the environment variables for **Production**:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Neon **pooled** string |
   | `DIRECT_URL` | Neon **direct** string |
   | `NEXTAUTH_URL` | `https://your-app.vercel.app` (or custom domain) |
   | `NEXTAUTH_SECRET` | Unique output of `openssl rand -base64 32` |
   | `ADMIN_PATH` | A unique path, e.g. `/panel-` + 32 random hex characters |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
   | `NEXT_PUBLIC_SITE_NAME` | your site name |

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are needed only in your local `.env` when you run the one-time seed; do not put them in Vercel.

Never point Preview deployments at the production database. Create a separate Neon branch/database for Preview, then set `DATABASE_URL` and `DIRECT_URL` for the **Preview** environment to that separate database. The Vercel build applies the schema to the database selected by the current environment.

### 4. Initialize the production admin account

The Vercel build automatically creates/updates database tables; do not run `prisma db push` separately for every deploy. After the first successful deployment, create the admin user and supplied portfolio content once from your machine. Put the **production** `DATABASE_URL` (pooled), `DIRECT_URL` (direct), `ADMIN_EMAIL`, and the exact `ADMIN_PASSWORD` you want to use into your local root `.env`, then run:

```bash
npm run db:seed
```

The seed is idempotent and does not add sample content. Re-running it updates the configured admin password and resets the supplied profile, projects and skills to their curated seed values; existing interface copy and unrelated records are preserved.
If this database was previously seeded with demo data, remove the example projects, articles, skills, and social links from the admin dashboard before publishing; the new seed does not delete existing data.

To apply the schema manually from a terminal, first set `DATABASE_URL` and `DIRECT_URL` in the project-root `.env` to the intended database, then run:

```bash
npm run db:push
```

This is equivalent to `npx prisma db push`. It changes the database named by those URLs, so verify that they point to the intended environment first. `.env` is local and must never be committed.

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

### Profil Berlin Koueni et contenu administrable

Le seeder contient le profil fourni, dix projets publiés (Guidtwam, FON KOUENI ERP et E-Commerce Platform sont mis en avant), neuf articles techniques publiés, les compétences regroupées par domaine, treize technologies pour la stack principale et les liens GitHub/LinkedIn fournis. Aucun niveau de maîtrise, date de réalisation, lien de démonstration ou résultat chiffré n'est inventé.

Après modification du schéma : `npm run db:push`, puis `npm run db:seed`. Le seeder utilise une transaction et des upserts : il ne supprime pas les projets personnalisés, articles, messages ou médias existants. Une nouvelle exécution remet les champs éditoriaux du profil, des dix projets et des compétences fournis à leurs valeurs du seeder. Les textes du site déjà enregistrés sont préservés. Le mot de passe du compte ADMIN_EMAIL est synchronisé avec ADMIN_PASSWORD.

Dans **Profile & Settings**, modifier l'identité, la marque, l'URL publique HTTPS, la tagline, les spécialités, les biographies, les coordonnées, l'avatar, le CV et le SEO global. La section **Public site content** permet de rechercher et modifier les intitulés de navigation, titres, boutons, textes de contact, noms des catégories, métadonnées des pages, langue et note de pied de page. Les projets, articles, réseaux sociaux et compétences conservent leurs éditeurs dédiés. L'ordre, la visibilité et la sélection **Main stack on homepage** se règlent dans Skills. Un niveau vide masque le pourcentage et sa barre.

Une sauvegarde dans le panel invalide immédiatement le cache public. Après un seed lancé en ligne de commande, redémarrer le serveur local ou attendre l'expiration du cache public (cinq minutes). Les secrets de connexion et paramètres d'hébergement restent dans l'environnement serveur.

Pour ajouter uniquement les articles, lancer `npm run db:articles`. Les neuf guides couvrent Laravel, React/Next.js, React Native/Expo, PostgreSQL, Docker/CI/CD, la sécurité des APIs, Linux/Nginx, Active Directory et UI/UX. Ils sont publiés en français avec une traduction anglaise, puis modifiables depuis **Articles** et **Content translations**. Les relances ajoutent seulement les articles manquants et préservent les modifications éditoriales existantes.

### Événements, souvenirs et galerie

La page `/moments` filtre les contenus publiés par type (événement, souvenir, galerie) et par album. Le panel **Events & Gallery** permet de créer, modifier, publier ou supprimer une entrée, avec date facultative, lieu, album, résumé, récit Markdown, couverture et jusqu'à vingt photos légendées. Une sélection **Feature on homepage** alimente l'accueil ; les brouillons restent privés. Les photos peuvent être ajoutées par URL ou via Cloudinary si le service est configuré. Les titres, textes et filtres de la rubrique sont éditables dans **Public site content**. Le seeder ajoute uniquement les fiches sourcées du Hacking Challenge GetSmarter (publiée) et de SMI-CYBER 2025 (note de veille en brouillon). Il ne crée aucun souvenir fictif.

Vérification du seed sans écriture : `npm run db:seed -- -- --verify-only`.

### Langues et thèmes

Les sélecteurs du header proposent **FR / EN** et **clair / sombre / automatique**, sur mobile comme sur ordinateur. Les choix sont conservés pendant un an dans des cookies de préférence. Le mode automatique suit le système et est appliqué avant le premier affichage. Le thème couvre aussi le panel et conserve les couleurs naturelles des photos.

Dans **Profile & Settings**, **Public site content** permet d'éditer les deux langues de l'interface et les valeurs par défaut `site.language` / `site.theme`. **Content translations** gère les biographies, projets, articles, événements et légendes photo. Une traduction vide reprend le texte original. Les traductions de brouillons sont exclues des données envoyées aux visiteurs. Les lectures de langue restent hors du cache partagé pour éviter de mélanger les visiteurs.

`npm run db:translations` ajoute les traductions des contenus fournis via DIRECT_URL, sans réinitialiser les projets ni les comptes et en conservant les textes personnalisés. Une nouvelle exécution du seeder sur une base neuve prépare aussi les traductions.

La rubrique Moments propose une vue chronologique et une galerie. Une date peut être précise au jour, au mois ou à l'année, selon les informations disponibles.

`npm run db:moments` ajoute ces deux fiches et leurs traductions sans réinitialiser le profil ni remplacer les événements modifiés dans le panel. La fiche SMI-CYBER ne présume aucune participation personnelle.


## Editorial design

The redesign preserves the original Inter and JetBrains Mono fonts and every light/dark color token. Its visual decisions and reference analysis are documented in `design-system/berlin-koueni/MASTER.md`.

- The homepage combines an SVG identity motif, an open featured-project layout, technical expertise and real gallery photographs.
- Project covers use administrator-supplied images; when missing or unavailable, a decorative SVG cover uses the actual title and tags.
- Skills use native disclosures. Moments offer timeline/gallery views, kind filters and album selection.
- New French and English headings live under `redesign.*` / `en:redesign.*` in **Settings → Public site content**. Defaults are merged on read, so no reseed or migration is needed and existing editorial changes stay intact.
- Navigation supports Escape to dismiss its mobile menu, visible keyboard focus and comfortable touch targets. Contact fields retain their labels and link validation messages to each input.

### Motion and accessibility

Page entrances and the hero's SVG drawing run once. Project and gallery filters animate only when their content changes; the menu preserves keyboard focus and remains inert while closed. Next.js shows a translated loading state on slower navigations. Reduced-motion preferences remove decorative movement and preserve visible content. This uses the existing Framer Motion dependency and does not affect editable site content or the database schema.
