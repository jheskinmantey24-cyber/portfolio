# Emmanuel Mantey — Developer Portfolio

A production-ready, five-page personal portfolio for **Emmanuel Mantey**, full-stack
software developer. Custom design system, vanilla JavaScript (no frameworks), and a
Node.js/Express contact API.

> **Design goal:** the site itself is the strongest work sample — every interaction
> (filtering, modals, validation, animations) is hand-built in this repository.

---

## What's inside

```
portfolio/
├── frontend/                 ← fully static — deployable on ANY web host
│   ├── index.html            Home (hero, marquee, services, featured work, CTA)
│   ├── about.html            Story, philosophy, 7-step process, direction
│   ├── skills.html           Live demos, API terminal, git animation, code showcase
│   ├── projects.html         Filtering, case-study modals, GitHub showcase
│   ├── contact.html          Contact cards + validated form
│   ├── css/                  main (tokens) · components · animations · responsive
│   ├── js/                   config · main · navigation · animations · skills ·
│   │                         projects · contact · contact-links
│   ├── assets/               icons + images (all editable placeholders where noted)
│   ├── robots.txt / sitemap.xml
├── backend/                  Node.js/Express contact API (optional to run)
│   ├── server.js  · routes/ · controllers/ · middleware/ · services/
├── .env.example              documented environment variables
├── package.json
└── README.md                 ← you are here
```

## Quick start

```bash
# 1. Backend (optional — needed only for the contact form)
npm install
cp .env.example .env        # then edit values
npm run dev                 # API on http://localhost:5000

# 2. Frontend
# open frontend/index.html in a browser, or serve statically:
npx serve frontend          # any static server works
```

The contact form posts to `js/config.js → EM.apiBase + "/api/contact"`.
With `apiBase: ""` it targets the **same origin**; set a URL to use a
separately hosted backend.

---

## Before you publish — EDITABLE PLACEHOLDERS

Nothing has been fabricated. These items are intentionally left as clearly-marked
placeholders and must be filled with verified data:

| What | Where |
| --- | --- |
| Email, phone, GitHub username, LinkedIn URL | `frontend/js/config.js` → `EM.contact` |
| Availability text | `frontend/js/config.js` → `EM.availability` |
| Project statuses, repository & demo URLs | `frontend/js/projects.js` → `PROJECTS` (search `null`) |
| Case-study wording accuracy (marked `MODERATELY EDIT`) | `frontend/js/projects.js` |
| Project cover graphics (labeled concept previews, not real screenshots) | `frontend/assets/images/projects/*.svg` |
| Production domain (`example.com` placeholders) | `frontend/sitemap.xml`, `frontend/robots.txt`, OG meta tags in each page's `<head>` |

Email / GitHub / LinkedIn cards render honest "configure in js/config.js" text
until real values exist — **no links point to `#` and no profiles are invented.**

---

## Image & font credits

- **Fonts** (Google Fonts, OFL licensed): Manrope (headings), Inter (body),
  IBM Plex Mono (technical labels). Loaded with `display=swap` + preconnect.
- **Photography** (Unsplash — [Unsplash License](https://unsplash.com/license):
  free to use, no permission needed, attribution appreciated):
  - `workspace-analytics.jpg` — home hero workspace
  - `developer-typing.jpg` — About page
  - `modern-office.jpg` — About page
  - `devtools-inspect.jpg` — Skills page
  - `planning-desk.jpg` — Contact page
- Project covers are **original concept-preview SVGs** rendered in this repo:
  the POS and Business OS covers are clearly labeled concept previews with
  demo data (their applications are not finished), and the Portfolio cover is
  a faithful rendered replica of this site's real homepage design. None of
  them imitate someone else's screenshots.
- Portrait: **real photo in place** — `assets/images/portrait-mantey.jpeg`,
  owner-provided (originally uploaded as `frontend/images/mantey.jpeg`);
  it is also embedded in the Portfolio project cover. If a different portrait
  is ever needed, replace that file and the two `<img>` references
  (`index.html`, `about.html`) together.

---

## Contact form delivery — how it really works

The form never pretends success. Its states:

| Situation | Behaviour |
| --- | --- |
| API reachable, message accepted | `201` → success confirmation shown |
| Rate limit hit | `429` → "wait a while" message with email fallback link |
| Validation failed server-side | `400` → specific field message |
| API unreachable / not deployed | plain error: form says delivery didn't happen |
| SMTP not configured | message **accepted and stored** to `backend/data/submissions.jsonl`; logs note the missing email config |

### Enabling real email delivery

Every submission is addressed to **jheskinmantey24@gmail.com** —
`CONTACT_TO_EMAIL` is already set in `backend/.env` and in
`.env.example`. The only missing piece is an SMTP account to send
through. Set in `.env` (use a Gmail App Password — the recipient is a
Gmail mailbox — or a transactional provider such as Brevo):

```
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<sender-gmail-app-account>@gmail.com
SMTP_PASS=•••••••• (16-character App password, not the login password)
CONTACT_TO_EMAIL=jheskinmantey24@gmail.com
CONTACT_FROM_EMAIL=<sender-gmail-app-account>@gmail.com
```

To create an App password: Google Account → Security → enable
2-Step Verification → 2-Step Verification → App passwords. With
`EMAIL_ENABLED=false` (current state), submissions are queued to
`backend/data/submissions.jsonl` and the form still confirms
successful receipt — nothing is lost, just not emailed yet.

Secrets live **only** in `.env` (gitignored, see `.gitignore`). They are never
placed in frontend JavaScript and never returned to the browser.

---

## Security (implemented)

- server-side validation of every field (authoritative, mirrors client rules)
- request body size limit: 16 KB JSON
- in-memory sliding-window rate limiting: 5 submissions / IP / hour (`CONTACT_RATE_LIMIT`)
- security headers: CSP (`default-src 'none'`), `X-Frame-Options`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS when HTTPS is detected
- restricted CORS via `ALLOWED_ORIGINS` (empty = same-origin only)
- honeypot field for spam bots (server rejects anything that fills it)
- all dynamic data rendered with `textContent` / safe text nodes — no `innerHTML`
  with untrusted values; external API responses are handled defensively
- no stack traces in production (`NODE_ENV=production`)
- graceful shutdown on `SIGTERM`/`SIGINT`

## Accessibility & performance

- semantic landmarks, skip-link, focus-visible styles, keyboard-operable tabs/dialog/filter
- native `<dialog>` case studies (focus trapping + Escape for free)
- `prefers-reduced-motion` fully respected (parallax/marquee/dash motion disabled)
- responsive 320 → 1440px+, no horizontal overflow
- deferred JS, lazy-loaded below-fold images, CSS-first animations,
  IntersectionObserver pauses off-screen work
- Google Fonts with `display=swap` + preconnect (optionally self-host later)

## SEO

Each page: unique title/description, Open Graph tags, semantic heading order.
Home page ships Person JSON-LD (verified facts only). `sitemap.xml` + `robots.txt`
included. **When the production domain is known:** find-and-replace
`emmanuel-mantey.example.com`, add absolute canonical URLs + `og:url`, and add
`"url"` to the JSON-LD.

---

## Deployment

### Option A — standard web hosting (static only, e.g. basic Hostinger plan)

1. Upload the **contents of `frontend/`** to `public_html/` (or a subfolder — all
   asset paths are relative, so both work).
2. Force HTTPS (Hostinger: Websites → Force HTTPS).
3. The contact form needs one of:
   - **Option B's Node.js backend** hosted elsewhere ( Railways, Render, VPS… ) —
     then set `apiBase` in `frontend/js/config.js` to that HTTPS URL, **and** add
     the frontend domain to the backend's `ALLOWED_ORIGINS`. **Note: most shared
     Hostinger web-hosting plans do not run persistent Node.js apps** — check your
     plan's features.
   - or swap `frontend/js/contact.js`'s `fetch()` to a hosted form service
     (Formspree/Getform): replace the endpoint and map fields to their API.
4. Update the domain placeholders (see SEO section).

### Option B — Node.js-enabled hosting (VPS, cloud, or a plan with Node support)

```bash
npm install --omit=dev
NODE_ENV=production PORT=5000 node backend/server.js
```

- Set `ALLOWED_ORIGINS=https://your-domain.com`
- Use a process manager (`pm2 start backend/server.js`) or the platform's own
  supervisor, and put HTTPS termination (Nginx/Cloudflare/Load balancer) in front.
- Keep serving the frontend as static files (Option A step 1) — the API and the
  site are independent, so one failing does not take down the other.
- With `apiBase: ""` and the API reverse-proxied at the same domain under `/api`,
  no frontend change is needed.

### Two API URLs, one place

`frontend/js/config.js` is the single switch for the API base URL. Never hardcode
`localhost` anywhere in production — it only appears in the local dev instructions
and the code-sample tab, which is intentionally local-only.

---

## Testing notes (be honest, measure)

Lighthouse: run against the deployed HTTPS URL, record real scores. Claims here
are deliberately limited to what's implemented, not to projected audit numbers.

## License

MIT — © Emmanuel Mantey.
