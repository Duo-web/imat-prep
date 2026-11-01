# IMAT Prep — Product Audit, Competitor & Marketing Research

Date: 2026-11-02 · Repo: `Duo-web/imat-prep` (local clone at `/media/azlan/storage/home/azlan/data/imat-prep`, HEAD `983a4cc`, Day 7)
Method: full source read (40 files, ~6.3k LOC) + live competitor/market research (all prices and dates checked 2026-11-01/02).

---

## 1. Bottom line

You have a **competent technical scaffold** wrapped around a **README that markets features that do not exist** and a **monetisation layer that is 100% aspirational** (Stripe is imported nowhere; nothing can take money).

But the more important finding is not about code. It is this:

> **Your free tier is not a product. Giving away IMAT past-paper PDFs is not a differentiator — at least six competitors already do it, free, linked straight to the ministry's own archive.**

What is scarce, and what students actually pay for, is *solved questions with worked explanations, honest answer keys, and a score that tells them where they will actually rank*. That is the product. Everything else is packaging.

Market reality: **18,368 candidates sat IMAT 2026** (record, +36% YoY) against **3,922 English-taught places** (~4.7 applicants per seat). It is a real, fast-growing, and **small** market. At €12/month, capturing 3% of the field for a 6-month prep run is roughly €40K/year. This is a niche business, not a startup — which is fine, as long as you decide it deliberately.

---

## 2. Pros — what you actually have

| Strength | Evidence |
|---|---|
| Auth is genuinely solid | NextAuth credentials + bcrypt cost 12, zod-validated registration (`app/api/auth/register/route.ts:6-37`), JWT carries subscription state (`lib/auth.ts:42-56`), middleware-protected routes (`middleware.ts:18-25`) |
| Free-quota enforcement is **server-side against the DB**, not the stale token | `app/api/quiz/start/route.ts:48-83` + `DailyQuestionLimit` model (`prisma/schema.prisma:71-84`) — most solo builds get this wrong |
| Scoring is real IMAT scoring, not naive | +1.5 / −0.4 / 0, `/90` (`app/api/quiz/finish/route.ts:46-49,137-139`) |
| The 200 seeded questions are real questions, not lorem-ipsum | e.g. the haemophilia pedigree item at `prisma/seed.ts:142-146` has a correct answer and a proper explanation. Distribution: Bio 77 / Chem 50 / Phys 24 / Maths 20 / Logic 16 / Reading 13 |
| Schema is thoughtfully indexed; TS `strict: true` | `schema.prisma:80-83,139-142`; `tsconfig.json:6` |
| Ownership checks on every quiz route | `submit/route.ts:25-27`, `finish/route.ts:26-28`, `[id]/page.tsx:30` |
| Mobile-first Tailwind UI, tidy git history (one PR per roadmap day) | honest commit log |

Translation: the foundation is good enough that you do **not** need a rebuild. You need content, money, and distribution.

---

## 3. Cons — three buckets

### 3a. Claimed but completely absent (these are reputation risks, not feature gaps)

| README claim | Reality |
|---|---|
| Unlimited practice + worked solutions (premium) | Explanations are already sent to every client anyway — nothing to gate |
| **30+ full exam simulators** | Data supports **3–4** papers, and one has only 20 questions — a 60Q/100min exam silently truncates (`app/quiz/[id]/page.tsx:62-66`) |
| Performance dashboard & analytics | Hardcoded zeros and literal "coming on Day 8" text (`app/dashboard/page.tsx:19,25-27`). `recharts` and `date-fns` installed and used **nowhere** |
| Personalized study planner | No page, no model. Middleware matches `/planner/:path*` that does not exist |
| Community forum per question | No model, no page |
| Dark mode | `darkMode: "class"` set in `tailwind.config.ts:4`, zero toggle/theme provider |
| IMAT news & exam updates | Nothing |
| 10 questions/day free | Works, but see 3b |
| €12/€79/€149 pricing | **No Stripe wiring at all.** `lib/stripe.ts` is dead code; no checkout route, no webhook, no pricing page. `/dashboard/pricing` (linked from `app/papers/page.tsx:66,134`) is a 404. `subscriptionStatus` can never leave FREE except by editing the database |

### 3b. Security / correctness — fix before real users

1. **Answers leak to the browser.** Full `Question` objects including `correctAnswer` and `explanation` are passed as props into both engines (`app/quiz/[id]/page.tsx:109-126`). They sit in the RSC payload. A student can read the answers during a "simulator". For a career-defining exam product, this is the kind of thing that gets screenshotted on Reddit.
2. **Premium PDFs are public files.** Locked papers live in `public/` — `curl /papers/imat-2025.pdf` works regardless of plan. Locked years **2020–2022** have DB rows pointing at files that do not exist → 404 on unlock. Model papers surface as year "9001" with empty `pdfUrl` → broken download buttons.
3. **Quota accounting is wrong.** The daily limit is consumed at session *start* for the whole booked set (`start/route.ts:117-142`) and `/submit` does no limit check — abandon a 10-question session and you've burned your day; replay `/start` and you can exceed the cap.
4. **Stale entitlement.** `subscriptionStatus` is only set at login (`lib/auth.ts:43-48`) — a payer stays "FREE" in the UI until re-login; a revoked subscriber stays "premium".
5. Smaller: `new Stripe(...)` at module scope crashes on import without env (`lib/stripe.ts:3`); `images.domains: ["pub-*.r2.dev"]` — wildcards are unsupported there (`next.config.mjs:4`); `whereClause: any` defeats strictness (`start/route.ts:87`, `[id]/page.tsx:54`); no rate limiting on login/register; **`prisma/migrations/` is gitignored** so deploys are `db push` with no migration history; no tests, no CI, no sitemap/robots/structured data, no `loading`/`error`/`not-found` boundaries; dead file `components/quiz/QuizEngine.tsx`.

### 3c. Product gaps that matter commercially

- **200 questions is not a question bank.** Competitors advertise 5,600+ (IMAT Buddy) and 7,000+ (Pava). You cannot compete on volume as a solo dev — you have to compete on *transparency, explanation quality, and analytics*.
- **No percentile.** You have no ranking/calibration feature at all, and that is the one thing this audience is desperate for (see §5).
- **No email capture anywhere.** Your only asset today is a PDF download that gives you nothing in return.

---

## 4. Competitors (all verified live, as of 2026-11-01)

| Competitor | Price | Offers | Weakness |
|---|---|---|---|
| **IMAT Buddy** | €279 one-off (list €400) | 5,600+ Qs w/ solutions, all past papers solved, mocks, video | Dated WordPress site, no analytics/personalisation, one-off payment |
| **Pava Test / Italy Medical Schools** | Freemium | 7,000+ Qs, timed mocks, free WhatsApp channel, claims "43/60 of IMAT 2026 were already on Pava" | **The one to fear** — best SEO moat, EN/IT/TR. Monetisation unclear |
| **Enter MedSchool** | €199/yr (promo) | Course + tutoring pitch, already on IMAT 2027 | Price seen in a search snippet only — page blocked my fetch; verify |
| **IMAT Mentor** | €299 self-study | Question bank, live-class tiers | Small, low visibility |
| **MedItalia / Future MedsAcademy** | €312 / 3 months | Prep + cut-off & rank tools, free trial | 2.6× your price |
| **Testbusters (medschool.it)** | Not public | Live/blended, private-university tests | Consultation-gated pricing = friction |
| **Scuola Leonardo (Milan)** | €2,060 | In-person with real teachers | Price, physical only |
| **MedStudy** | €1,899 live course | Live teaching | Thin site, cash-grab profile |
| **Acadimat** | Not public | Bootcamps, translated TOLC-MED papers, ranking tracker | Event-led, expensive logistics |
| **The Medic Portal / Medic Mind** | UK pricing | Guides only — no real IMAT product | Not actually competing here |
| Thin brands: imatprep.in, imatify.site, Daan "Ultimate IMAT Collection" PDF | €0–50 | Rebranded past papers | Confirms the gap you're aiming at |
| **Free substitutes** | €0 | Official MUR/CINECA archive (accessoprogrammato.mur.gov.it), r/StudyInItaly (17.3k), r/IMATexam (**owned by Locomotive**), FB groups, YouTube, Anki/Quizlet, Alpha Test books | Baseline everyone repackages |

Note: **MedEntry** is Irish (HPAT/UCAT) and not an IMAT operator; "Pass IMAT", "Medic Master", "KaTest", "ExamGO", "imatprep.com" did not surface as credible IMAT brands.

### Positioning read

Four clusters exist: (a) premium human-led €1,700–2,100, (b) one-off self-study €199–400 — the volume market, (c) freemium question bank with an SEO moat (Pava), (d) free/cheap repackaged papers.

**Nobody occupies low-monthly recurring.** At €12/mo, a six-month run is €72 — under every serious paid option, and it undercuts the one-off €279 buyer who just wants practice + analytics. That is your gap, and it is open today. It is also obvious, so it is not defensible for long: **Pava converting its SEO moat into a €10–15/mo tier would squeeze you out.** Move first or don't move.

What you cannot compete on: tutor networks, 5–7K authored questions with worked solutions, institutional trust. What you can: price clarity (no consultation gating), speed of content refresh after each ministry decree (most competitors take months; Pava's Oct 2026 refresh beat nearly everyone), per-topic analytics tuned to the +1.5/−0.4 scoring, mobile cramming drills, and published sourcing transparency.

---

## 5. The existential risk: the exam is re-set by decree every summer

Verified: **IMAT survives and is not renamed — for now.** Legislative Decree 71/2025 (with Law 26/2025) abolished the entrance test **only for Italian-taught** medicine (the "semestre filtro"); Art. 8(3) explicitly excludes English-taught courses. MUR Decree **1005 of 6 Aug 2026** set IMAT 2026/27 for **29 Sep 2026** (already sat: results 8 Oct, national ranking 26 Oct, first reallocation 3 Nov 2026). Format: 60 questions / 100 minutes / /90 points (23 bio, 15 chem, 13 phys+math, 5 logic, 4 reading&GK), paper-and-pen, run by MUR via CINECA on Universitaly, ~25 test venues worldwide.

**The IMAT 2027 decree does not exist yet.** Dates, format and name are re-settable annually, and the 2026 decree landed only ~8 weeks before the exam. Italy has changed the admission system three times since 2022.

Practical consequence: build the platform around *"the English-taught Italian medicine entrance exam"* with a **config-driven year/format layer** (questions-per-section, timing, scoring, exam date, registration window, decree status) instead of hardcoding "IMAT = 60Q/100min". Mitigating: English-taught seats are *expanding* (Florence, Milano-Bicocca, Padua MedTech, Venice, Tirana), so the constituency is growing.

---

## 6. Marketing — the main event

### 6.1 Calendar (this is the strategy)

IMAT 2026 is done. Next cohort = **IMAT 2027** (expected early–mid Sept 2027, date unannounced). Right now, in November 2026, two high-intent groups are live and cheap to reach:

1. The **~14,000–15,000 candidates who placed nowhere in 2026** and are deciding whether to resit.
2. New A-level/IB/grade-12 students starting early prep.

Seasonality: decree ~Aug → registration late Aug/early Sep → exam late Sep → rankings Oct–Nov → **next cohort starts prep Oct–Jan**. Selling window peaks **Oct–May**; Jul–Sep is crunch-time panic.

**You are in the first week of the best window of the year. Do not wait for feature-complete.**

### 6.2 Positioning

Not "a cheaper IMAT site". Instead:

> **"Know your real score before you pay anyone €2,000."**
> Free full mock, marked against the actual official IMAT distribution, with every question sourced to its paper and answer key. Practice at €12/month, or €79 for the year.

Anti-anchor against the €1,899–2,060 academies, and against the free-PDF sites that leave you guessing.

### 6.3 The hero product is the free mock + percentile

The MUR 2026 score distribution exists (18,368 scores, median moved 40.6 → 51.2). Build a **free 60-question mock that returns a score out of 90 plus "this would have placed you at/near/above the 2026 cut-off for X university"**. Nobody can fake that, competitors' cut-off tools are approximate, and it is a shareable artefact (people post scores). Make it the top of funnel — **not a paid feature**.

### 6.4 Channels, ordered by impact-per-hour for one person at ~€0

| # | Channel | Why / how | Realistic ceiling |
|---|---|---|---|
| 1 | **Community answer-giving** (FB groups, Reddit, WhatsApp) | Zero cost, immediate, entire market is 18K humans you can touch by hand. Locomotive already owns r/IMATexam — that's proof the channel works, and it's not exclusive | Brand search lift; email signups |
| 2 | **Solved-question short-form video** | "Solve a real IMAT 2025 question in 60 seconds" — repeatable, low-edit, demonstrates competence, which is the only ad a solo dev can afford. Repost TikTok/Reels/Shorts. Niche is micro (@pathwayitalia: 7,058 followers / 439K likes) — nobody owns it yet | 10–30K views/yr possible; unproven |
| 3 | **Free-mock-as-lead-magnet + email drip** | Only mechanism that compounds; every other channel feeds it | 6–12% visitor→signup on cold traffic |
| 4 | **Long-tail solved-question SEO** | Per-question pages ("IMAT 2025 Q38 explained"), topic pages ("IMAT logic questions", "IMAT vs UCAT"), and a **decree-day template** you publish within 2 hours of MUR. Head terms are low-ceiling single-digit-thousands/month seasonal. New domains: first rankings 3–6 months, page 1 at 9–18; only 1.74% of new pages reach top-10 within a year | Build it as the **2027→2028 asset**, not a 90-day channel |
| 5 | **Affiliate, not stipends** | €79/yr cannot fund $875–1,500 campus-ambassador stipends. Offer **30–40% revenue share on tracked codes** to 2026 admits — instant credibility ("got 68 and got into Statale") + zero fixed cost | 5 affiliates × ~10 sales |
| 6 | **Education agents** (Lahore, Karachi, Istanbul, Cairo, Lagos, Nicosia) | 97% of agents are commission-driven; Italian public tuition is low so they earn little per Italy student — but counsellors run IMAT webinars and control cohorts of 20–200. Pitch: free classroom licences + the mock/percentile report as *their* lead magnet. Verify each agency before paying | Slow, high-value, post-90-day |
| 7 | **Paid ads** | **Skip.** Italy Meta CPM ~€10.5, link-click ~$0.37, education search CPC ~$4.81. At €79/yr and 1–3% free→paid your affordable CAC is €5–10. Search CPC alone breaks the model | Negative ROI at this LTV |

Also skip: Gumroad/App Store distribution, broad "study in Italy" informational SEO (agency-dominated, high difficulty).

### 6.5 Trust — you're an unknown solo dev asking for a career-defining purchase

Ordered by power:
1. **Free mock with real percentile comparison** against published MUR data.
2. **Radical sourcing transparency**: every question labelled year/paper/official key, plus a public "where we disagree with the MUR key and why" page. (Your existing instinct — "no source, no claim" — is exactly right for this market.)
3. **Money-back tied to the exam, not the product**: "if your mock score hasn't improved by 1 Sept, full refund." Time-boxed, so cost is bounded.
4. **Named face**: your name, photo, a 3-minute walkthrough video on the pricing page. Solo is a *feature* against €2,000 academies — cheap and fast fixes are the proof.
5. **Harvest results publicly**: a "Class of 2027" page (university + score), collected through the affiliate programme.

### 6.6 Benchmarks — use the pessimistic column

| Metric | Blog claim | Realistic for you |
|---|---|---|
| Freemium free→paid | 8–14% | **1–3% in year 1** (20% of products convert <2.5%) |
| Visitor→signup (lead magnet) | 20–35% | **6–12%** cold search |
| Monthly churn | — | Education ~4.99%/mo total (3.3% voluntary); ~38%/yr on monthly billing |
| New-domain organic ramp | — | rankings 3–6 mo, page 1 9–18 mo; ~63% of top-10 pages are >3 yrs old |
| "Traction" before spending money | — | 1,000 emails, 20–40 paying, 3 named success stories |

**Pricing conclusion:** users have ~11 months of shelf life per candidate and monthly churns at ~38%/yr, capping monthly LTV around €100 anyway. **Push €79/yr and €149 lifetime hard; de-emphasise €12/mo** — present monthly only as an on-ramp with a visible "save €65 by going annual" nudge.

### 6.7 90-day plan (one person, ~€0 spend)

| Days | Work | Single metric |
|---|---|---|
| **1–14** | Fix money + leaks (§7 items 1–3). Publish "IMAT 2027: what we know + how to start in November" hub. Ship **free mock + percentile**. Start "3 solved questions a week" series. Join 5 FB groups + Reddit with answers only. Strip every false claim from the README/site. | **Emails captured — target 300** |
| **15–45** | 20 short-form question videos. 60 worked-solution pages. Recruit 3–5 of the 2026 admits as 35% affiliates. Run a "resit 2027" offer into the 2026-failed cohort via groups. Pitch 10 agencies (free classroom licences). | **Free mocks completed — target 500** |
| **46–75** | First paid cohort: lifetime at intro price to the warm list only. Publish 5 named results. WhatsApp broadcast list. One long-form YouTube "my 8-month IMAT plan". | **Paying users — target 25–40** |
| **76–90** | Kill formats under 1% CTR; double the top two. Pre-write the decree-day template so you publish within 2 hours of MUR. | **Revenue — target €1.5–2.5K** |

Before feature-complete, ship exactly five things: **mock + percentile, solved past-paper bank, email capture + drip, a real payment link, refund/terms page.** Everything else (planner, forum, dark mode, analytics charts) is a post-exam luxury.

---

## 7. Implementation order

Impact-per-day, given the codebase as it stands:

1. **Payment path** (≈2–3 days): Stripe Checkout route + webhook writing `subscriptionStatus`/`subscriptionEnd`, a real `/pricing` page, and entitlement read fresh from the DB on each gated action (not from the JWT). Without this you have a hobby, not a business.
2. **Stop leaking answers** (≈1 day): never send `correctAnswer`/`explanation` before grading; return explanations only from `/submit` and only in review mode. Move locked PDFs out of `public/` behind an authenticated/signed route.
3. **Fix broken surface** (≈1 day): 2020–2022 rows, model papers as "year 9001", empty `pdfUrl` cards, `/dashboard/pricing` 404, `/planner` middleware. Delete or build.
4. **Rewrite claims to match reality** (≈half a day): README and landing page. "30+ simulators" and the dashboard "coming Day 8" placeholder must go. In this market a false claim is a screenshot on Reddit.
5. **Free-mock + percentile engine** (≈3–4 days): the hero funnel product. Needs the official 2026 distribution baked in, and a shareable result card.
6. **Question bank: depth over breadth** (ongoing, this is the real moat): get to ~600 genuinely solved, sourced, explained questions covering 2015–2026 papers before adding any new feature. Prefer transcription from official MUR papers; **do not copy competitor-written solutions** — that's their IP, and students talk.
7. **Email capture + drip** (≈1 day): gate the PDF download behind an email, 5-message sequence keyed to the exam calendar.
8. **Deploy hygiene** (≈2 days): un-ignore `prisma/migrations`, add CI + typecheck/lint/test, `sitemap.ts`/`robots.ts`/structured data, rate-limit auth routes, remove `any`, delete dead `QuizEngine.tsx`, add `loading`/`error` boundaries.
9. **Then, and only then:** analytics dashboard (recharts is already installed), study planner, dark mode, forum.

Also worth doing now, cheaply: make exam format/date/year **config-driven** (§5), because the 2027 decree will force a change and competitors who update fastest win the season.

---

## 8. Honest strategic risks

- **Small TAM.** 18K candidates/year, price-sensitive, 11-month shelf life each. This can be a very good €40–80K/yr solo business and a bad venture business. Pick which you're building.
- **Regulatory whiplash.** Name/format/date re-decided annually by decree. Config-driven now, or you re-write the product every August.
- **No moat in content at 200 questions.** Your only durable moats are percentile calibration, sourcing transparency, and speed of seasonal content refresh.
- **Pava Test** is the competitor to watch: it has the SEO moat, the free WhatsApp channel, the recall statistics, and could add a €12 tier. Your advantage is only that they haven't yet.
- **Trust deficit** is the real conversion barrier, not price.

---

## Sources

Ministry / official: https://www.mur.gov.it/it/atti-e-normativa/decreto-ministeriale-n-1005-del-06-08-2026 · https://www.universitaly.it/en/imat · https://accessoprogrammato.mur.gov.it/2026/index.php?pag=IMT · https://accessoprogrammato.mur.gov.it/compiti/CompitoInglese2025.pdf
Market & exam data: https://www.italymedicalschools.com/admission-tests/ · https://www.italymedicalschools.com/imat-2027/ · https://www.italymedicalschools.com/imat-results/ · https://www.italymedicalschools.com/imat-rank-checker/ · https://www.studyu.org/en/blog-imat-medicine-in-italy · https://www.applyaz.com/study-in-italy/imat-exam · https://meditaliano.com/minimum-score
Competitors: https://www.imatbuddy.com/ · https://www.imatbuddy.com/imat-2026-results-rankings-and-cut-off-scores/ · https://test.pavaedu.com/ · https://entermedschool.com/imat-course · https://entermedschool.com/imat-papers · https://www.imatmentor.com/pricing · https://medschool.it/ · https://www.acadimat.com/imat-2026/ · https://meditaliano.com/ · https://www.med-study-imat-courses.com/ · https://accademiaditaliano.it/en/imat/ · https://www.themedicportal.com/ · https://www.medicmind.co.uk/medicine-ucas-guide/imat-registration-dates-and-booking/ · https://thisislocomotive.com/imat-past-papers/ · https://thisislocomotive.com/imat-2026-news-and-updates/ · https://www.applyaz.com/study-in-italy/imat-past-papers · https://imatprep.in/exam.html · https://imatify.site/
Communities: https://www.reddit.com/r/StudyInItaly/ · https://prowlo.com/tools/subreddit-stats/studyinitaly · https://www.reddit.com/r/IMATexam/ · https://www.facebook.com/groups/imatexam/ · https://www.facebook.com/groups/207581132133965/ · https://www.tiktok.com/@pathwayitalia
Benchmarks: https://www.artisangrowthstrategies.com/blog/freemium-conversion-rate-benchmarks · https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/ · https://userpilot.com/blog/saas-average-conversion-rate/ · https://recurly.com/research/churn-rate-benchmarks/ · https://www.subjolt.com/guides/churn-rate-benchmarks/ · https://www.mailerlite.com/blog/best-lead-magnet-statistics · https://www.digitalapplied.com/blog/lead-magnet-conversion-benchmarks-2026-b2b-data-reference · https://ahrefs.com/blog/how-long-does-it-take-to-rank-in-google-and-how-old-are-top-ranking-pages/ · https://www.seosavages.com/glossary/how-long-does-it-take-to-rank/
Ads & agency channel: https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/italy · https://www.dfriends.cz/en/blog/facebook-ads-cost · https://theadspend.com/blog/google-ads-search-education · https://www.flywire.com/resources/international-education-agents-101 · https://www.universityworldnews.com/post.php?story=20230926151616737 · https://www.interndock.com/tracker/guides/campus-ambassador-programs-open-now · https://smartscholars.app/ambassadors · https://unipi.it/en/about-us/international-relations/international-student-recruitment-agents/

**Verified vs inferred:** all code findings are from direct file reads at HEAD `983a4cc`. Competitor prices, exam dates, candidate counts and community sizes were read from live pages on 2026-11-01/02. **Not verified:** keyword search volumes (no Ahrefs/Google Keyword Planner access); EnterMedSchool's €199 (search snippet only — page returned 429); IMAT candidate nationality breakdown (not published). The TAM ceiling, positioning-cluster analysis, "nobody occupies low-monthly" and the CAC/budget math are **my inference**, not published facts.
