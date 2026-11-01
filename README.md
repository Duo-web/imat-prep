# IMAT Prep Platform

**Practice, past papers and honest scoring for the International Medical Admissions Test.**

A focused prep platform for students applying to English-taught Medicine and Dentistry programmes at Italian public universities — built to cost a fraction of the €200–€2,000 courses that currently dominate this market.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-in%20development-orange.svg)
![Next.js](https://img.shields.io/badge/next.js-14.2-black.svg)
![TypeScript](https://img.shields.io/badge/typescript-strict-3178c1.svg)
![Prisma](https://img.shields.io/badge/prisma-5-2c3853.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-supabase-336791.svg)

> **Read this first.** This README describes the platform **as it exists in this repository**, not as it is planned. Anything not marked ✅ is not usable yet. The build and go-to-market plan lives in [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## Status at a glance

| Capability | State | Notes |
|---|---|---|
| Accounts: register / login / logout | ✅ Working | Credentials + bcrypt (cost 12), zod-validated input, JWT sessions, middleware-protected routes |
| Past paper library (PDF downloads) | ✅ Working | 8 papers on disk: 2015–2019, 2023, 2024, 2025. Listed from the database on a public page |
| Practice mode (per question, instant feedback) | ✅ Working | Server-side grading, explanations, flagging, question navigator, section filters |
| Exam simulator (timed, auto-submit) | ✅ Working | Timer + section breakdown. **Only 3 papers currently hold the 60 questions a full-length sitting needs** |
| Real IMAT scoring (+1.5 / −0.4 / 0, out of 90) | ✅ Working | Calculated server-side |
| Free daily question limit | 🚧 Working, needs rework | Enforced against the database rather than the token — but quota is consumed at session *start* and `/submit` does no re-check |
| Question bank | 🚧 Small | **200 questions seeded**, each with a written explanation. Enough for a demo, far short of a bank |
| Checkout / payments | ❌ Not built | `lib/stripe.ts` is imported nowhere: no checkout route, no webhook, no pricing page. Subscription state cannot leave `FREE` except by editing the database |
| Dashboard | ❌ Placeholder | Renders hardcoded zeros and a "coming Day 8" note |
| Performance analytics & charts | ❌ Not built | `recharts` and `date-fns` installed and unused |
| Personalised study planner | ❌ Not built | Middleware matches `/planner/*`; the page and the model do not exist |
| Per-question community forum | ❌ Not built | No schema model, no page |
| Dark mode | ❌ Not built | `darkMode: "class"` is configured; there is no toggle or theme provider |
| IMAT news / exam-date updates | ❌ Not built | — |
| Cloudflare R2 / Bunny.net | ❌ Not wired | Environment variables exist, no code uses them |

---

## The exam

IMAT is the national, ministry-run admission test for English-taught Medicine and Dentistry programmes at Italian public universities. It is administered by **CINECA on Universitaly** on behalf of **MUR**, paper and pen, at venues in Italy and roughly 25 countries.

Format **for the 2026/27 cycle**, per MUR Decree 1005 of 6 Aug 2026 (verified 2026-11-01):

| | |
|---|---|
| Questions | 60, five options each, one correct |
| Duration | 100 minutes |
| Maximum score | 90 points |
| Marking | +1.5 correct · −0.4 wrong · 0 unanswered |
| Content split | Biology 23 · Chemistry 15 · Physics & Maths 13 · Logical Reasoning 5 · Reading & General Knowledge 4 |
| Candidates 2026 | 18,368 competing for 3,922 English-taught places |

**Important:** Italian admission tests are re-set every year by ministerial decree, and the **2027 cycle was unannounced as of November 2026** — the 2026 decree appeared only ~8 weeks before the exam. Exam year, dates, duration and section weights must therefore be treated as **configuration, not constants**.

---

## Pricing

Planned tiers — **not yet transactable**:

| Plan | Price | Intended contents |
|---|---|---|
| Free | €0 | Past paper PDFs · 10 practice questions per day |
| Monthly | €12/mo | Unlimited practice · simulators · worked solutions |
| Yearly | €79/yr | Everything monthly · analytics · study planner · priority support |
| Lifetime | €149 once | Everything, no renewals |

Blocked on payment integration and server-side entitlement checks. Until those exist, only the Free tier is real.

---

## Architecture

| Layer | Choice | State |
|---|---|---|
| Framework | Next.js 14.2.5 — App Router, React Server Components | Wired |
| Language | TypeScript, `strict: true` | Wired |
| Styling | Tailwind CSS 3.4, mobile-first | Wired |
| Database | PostgreSQL (Supabase) | Wired |
| ORM | Prisma 5.16 | Wired |
| Auth | NextAuth 4.24, credentials provider | Wired |
| Validation | zod | Wired (registration) |
| Payments | Stripe 16 / @stripe/stripe-js 4 | **Not wired** |
| Charts | recharts | **Installed, unused** |
| PDF / video storage | Cloudflare R2 · Bunny.net | **Planned, unused** |
| Deployment | Vercel (target) | Not configured |

### Data model (`prisma/schema.prisma`)

```
User                      name, email, password, subscriptionStatus,
                          subscriptionEnd, timestamps
  ├── DailyQuestionLimit  unique (userId, date) — server-side free-tier quota
  ├── Attempt             per question: selectedAnswer, isCorrect, timeTaken
  └── Session             per sitting: paperId, mode, score, totalQuestions

Paper                     year (unique), title, pdfUrl, isFree,
                          totalMarks, durationMin

Question                  paperId, section (enum), topic, difficulty,
                          questionText, optionA–E, correctAnswer,
                          explanation, source
                          indexed on section · paperId · difficulty · topic
```

Domain enums: `SubscriptionStatus`, `Section`, `QuizMode`.

### Route map

```
Public      /login   /register   /papers
Protected   /quiz              bank browser with section filters
            /quiz/[id]         quiz running — practice or exam mode
            /simulator         full-length timed sitting
            /dashboard         placeholder, not yet built out

API         /api/auth/[...nextauth]    /api/auth/register
            /api/quiz/start    /api/quiz/submit    /api/quiz/finish
```

---

## Getting started

**Requires:** Node 18+ and a PostgreSQL instance (Supabase's free tier is fine). Stripe and R2 credentials are **not** needed to run the app locally.

```bash
git clone https://github.com/Duo-web/imat-prep.git
cd imat-prep
npm install

cp .env.example .env.local     # DATABASE_URL and NEXTAUTH_SECRET are mandatory
npm run db:generate
npm run db:push                # see the note below — there is no committed migration history
npm run db:seed                # 11 papers, 200 questions, one test user
npm run dev                    # http://localhost:3000
```

**Seeded test account:** `test@imatprep.com` / `password123` (Free tier).

> `prisma/migrations/` is currently gitignored, so `npm run db:migrate` produces history nobody else has. Use `db:push` for local work until migration history is committed.

**Seed contents, precisely:** 11 `Paper` rows (2015–2025) against 8 PDFs on disk; 200 questions distributed Biology 77 · Chemistry 50 · Physics 24 · Maths 20 · Logical 16 · Reading 13. Twenty are attributed to IMAT 2024; the remaining 180 sit in three model papers under internal year codes 9001–9003.

---

## Environment variables

**Required now:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`.

**Declared but unused by any code path:** all Stripe keys and price IDs, all Cloudflare R2 variables, `NEXT_PUBLIC_APP_NAME`.

`lib/stripe.ts` instantiates the client at module scope, so it will throw on import if it is ever used without `STRIPE_SECRET_KEY` set.

---

## Known issues

Recorded deliberately: shipping these would damage trust with an exam-candidate audience.

1. **Answers reach the browser.** `app/quiz/[id]/page.tsx` passes full `Question` objects — including `correctAnswer` and `explanation` — as props into the quiz engines, so they are readable in the RSC payload. That makes simulator cheating trivial and makes gating solutions behind a paywall meaningless. Grading must become the only path that returns an answer.
2. **"Premium" PDFs are public files.** Locked papers live under `public/`, so `/papers/imat-2025.pdf` downloads regardless of plan. They need an authenticated or signed route.
3. **Broken rows and dead links.** Papers for 2020–2022 exist in the database with no file on disk (404 on unlock); model papers render in `/papers` with year "9001" and an empty `pdfUrl`; the link to `/dashboard/pricing` from `app/papers/page.tsx` targets a route that does not exist.
4. **Free-quota accounting.** The allowance is consumed for the whole booked question set at session start, and `/submit` performs no limit check.
5. **Stale entitlement.** `subscriptionStatus` is written into the JWT at login, so plan changes are invisible until re-login. The quiz API re-reads the database and is unaffected.
6. **No tests, no CI**, no ESLint rules beyond the Next default, no `loading`/`error`/`not-found` boundaries, no `sitemap`/`robots`/structured data. `components/quiz/QuizEngine.tsx` is imported nowhere.
7. **No rate limiting** on login or registration.

---

## Roadmap

Ordered by what unblocks revenue — full detail, including market and marketing, in [`docs/ROADMAP.md`](docs/ROADMAP.md):

1. Checkout, webhook and entitlement — nothing else matters until money can move
2. Server-side answer protection and access-controlled PDFs
3. Repair broken paper rows and dead links
4. Free full mock exam returning a percentile against the published MUR score distribution
5. Question-bank depth: ~600 fully sourced, solved questions from official papers
6. Email capture on the paper download, with a drip keyed to the exam calendar
7. Deploy hygiene: committed migrations, CI, SEO basics, rate limiting
8. Then: analytics dashboard, study planner, dark mode, forum

---

## Development principles

- **Mobile first** — most candidates study on a phone.
- **Ship daily**, one focused PR per unit of work.
- **No claim ahead of the build.** If a feature is not in the code, it is not in the copy — least of all about scores, question counts or exam outcomes.
- **Cite the source of every question** (year, paper, answer key) and flag any disagreement with the official key.
- **Validate and authorise on the server.** The client is trusted for nothing: not entitlement, not answers, not grading.
- **Security before scale:** hashed passwords, validated input, ownership checks on every API route.

---

## Contributing

Private development for now; contribution guidelines will follow the first public release.

## License

MIT — see [LICENSE](LICENSE).

## Contact

Open an issue, or use the contact page once the product is live.

---

*Exam format, decree references and competitor pricing in these documents were verified against MUR / Universitaly and public competitor pages on 2026-11-01. Re-verify every admission-test cycle — Italian requirements change by annual decree.*
