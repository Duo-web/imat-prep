# IMAT Prep — Build & Go-To-Market Plan

Internal strategy document. Product truth lives in [`README.md`](../README.md); this is the plan, the market and the numbers.
Last updated **2026-11-02** · Sources verified 2026-11-01.

---

## 1. Where the original 14-day plan actually landed

| Original plan | Outcome |
|---|---|
| Days 1–7: setup, auth, schema, past papers, quiz engine, practice + simulator, fixes | ✅ Done, and done properly — server-side grading, DB-backed quota, real IMAT scoring |
| Day 8 dashboard | ❌ Placeholder page |
| Day 9 analytics | ❌ Not started (`recharts` installed, unused) |
| Day 10 Stripe | ❌ Not started — client file exists, nothing imports it |
| Day 11 study planner | ❌ Not started (no model, no page) |
| Day 12 UI polish / dark mode | ❌ Not started (config flag only) |
| Day 13 testing & security | ⚠️ Partially — bcrypt, zod, ownership checks; but answers leak to the client and premium PDFs are public |
| Day 14 launch | ❌ Not possible yet |

**Why it slipped:** a two-week estimate was set against a feature list that assumed content (a question bank) would appear as fast as code. Code was the easy part. The binding constraints now are **payments** and **content depth**, not UI.

---

## 2. Market snapshot (as of 2026-11-01)

| Competitor | Price | What they have | Where they're weak |
|---|---|---|---|
| IMAT Buddy | €279 one-off (list €400) | 5,600+ questions with solutions, all past papers solved, mocks, video | Dated site, no analytics or personalisation |
| Pava Test / Italy Medical Schools | Freemium | 7,000+ questions, timed mocks, free WhatsApp channel, strong EN/IT/TR SEO | Monetisation unclear; recall claims self-reported |
| Enter MedSchool | €199/yr promo | Course + tutoring pitch | Price unverified — page blocked our fetch |
| IMAT Mentor | €299 self-study | Question bank, live tiers | Low visibility |
| MedItalia / Future MedsAcademy | €312 / 3 months | Prep + cut-off and rank tools, free trial | 2.6× our price |
| Testbusters (medschool.it) | Not public | Live/blended courses, private-university tests | Consultation-gated pricing |
| Scuola Leonardo, Milan | €2,060 | In-person, real teachers | Price, physical only |
| MedStudy | €1,899 | Live course | Thin site |
| imatprep.in, imatify.site, past-paper PDF bundles | €0–50 | Rebranded official papers | Not serious products |
| **Free substitutes** | €0 | Official MUR archive, r/StudyInItaly (17.3k members), FB/WhatsApp groups, YouTube, Anki/Quizlet, Alpha Test books | This is the baseline we must beat, and we cannot beat it by giving the same PDFs away |

**Cluster analysis:** (a) premium human-led €1,700–2,100, (b) one-off self-study €199–400 — the volume market, (c) freemium question bank with an SEO moat, (d) free repackaged papers. **No one occupies low-monthly recurring.** €12/mo for a six-month run (€72) sits under every serious paid option and undercuts the €279 one-off buyer who only wants practice plus analytics. That gap is open today; it is also obvious, so it will not stay open — the realistic threat is Pava adding a €12 tier.

**Size:** 18,368 candidates in 2026 (record, +36% YoY) for 3,922 English-taught places. Trend 2022→2026: 11,496 · 10,086 · 10,931 · 13,494 · 18,368. English-taught seats are expanding (Florence, Milano-Bicocca, Padua MedTech, Venice, Tirana). **This is a real, growing, small market** — a good solo business, a bad venture business. Decide which deliberately.

**Seasonality:** decree ~Aug → registration late Aug/early Sep → exam late Sep → rankings Oct–Nov → next cohort starts prep Oct–Jan. **Selling window peaks Oct–May; Jul–Sep is panic season.** IMAT 2026 was sat on 29 Sep 2026, so we are at the start of the prep window for 2027, and the ~14,000 candidates who placed nowhere in 2026 are currently deciding whether to resit.

---

## 3. Positioning

> **"Know your real score before you pay anyone €2,000."**
> A free full mock marked against the actual official IMAT distribution, every question sourced to its paper and answer key. Practice for €12/month, or €79 for the year.

The hero of the funnel is the **free mock + percentile**, not the past-paper PDFs. 18,368 real 2026 scores are public (median 40.6 → 51.2 across recent years); converting that distribution into "this would have placed you near the 2026 cut-off for Milan / Pavia / Naples" is something no one can fake and something competitors' cut-off tools only approximate. It is also a shareable artefact — students post scores.

**What we cannot compete on:** tutor networks, 5,000+ authored questions, institutional trust. **What we can:** price clarity, speed of update after each annual decree (most competitors take months to re-paper their sites), analytics tuned to the +1.5/−0.4 scoring, mobile cramming drills, and published sourcing transparency.

---

## 4. Marketing — channels in order of impact per hour

| # | Channel | Plan | Note |
|---|---|---|---|
| 1 | Community answer-giving | Solved questions posted by hand in the FB groups, Reddit and WhatsApp channels. Answers first, link second | The whole market is ~18K people; you can touch a meaningful share without a budget. r/IMATexam is already competitor-owned — proof the channel works |
| 2 | One question per short video | "Solve a real IMAT 2025 question in 60 seconds", reposted to TikTok / Reels / Shorts | Competence is the only ad an unknown solo dev can afford. The niche is micro and unowned |
| 3 | Free mock → email → drip | Mock and paper downloads capture email; 5-message sequence keyed to the calendar | The only mechanism that compounds |
| 4 | Long-tail solved-question SEO | Per-question pages, topic pages, and a **decree-day template** published within 2 hours of MUR | Head terms are low-ceiling and seasonal. New domains rank in 3–6 months, page 1 in 9–18. This is the 2027→2028 asset, not a 90-day channel |
| 5 | Affiliate, not stipends | 30–40% revenue share on tracked codes for 2026 admits | Campus-ambassador stipends ($875–1,500) are unfundable at €79/yr; rev share also buys credibility |
| 6 | Education agencies | Lahore, Karachi, Istanbul, Cairo, Lagos, Nicosia counsellors run IMAT webinars and control cohorts of 20–200. Offer free classroom licences plus the mock/percentile report as *their* lead magnet | Slow, high-value, verify each agency before paying |
| — | **Paid ads: skip** | Italy Meta CPM ~€10.5, education search CPC ~$4.81 | At €79/yr and 1–3% free→paid, affordable CAC is €5–10. Search CPC alone breaks the model |

**Trust barriers, in order of power:** free mock with real percentile → question sourcing shown on screen, plus a public "where we disagree with the official key" page → money-back tied to the exam, not the product ("if your mock score hasn't improved by 1 September, full refund") → named face and a walkthrough video on the pricing page → a "Class of 2027" results page harvested through the affiliate programme.

### Benchmarks — use the pessimistic column

| Metric | Common claim | Assumption we plan against |
|---|---|---|
| Free → paid | 8–14% | **1–3% year 1** |
| Visitor → signup | 20–35% | **6–12%** cold search traffic |
| Monthly churn | — | Education ~4.99%/mo total; ~38%/yr on monthly billing |
| New-domain organic | — | first rankings 3–6 months, page 1 9–18 months |
| "Traction" before any ad spend | — | 1,000 emails, 20–40 paying users, 3 named success stories |

### 90-day plan (one person, ~€0 spend)

| Days | Work | Single metric |
|---|---|---|
| 1–14 | Ship build items 1–3 below. Publish the "IMAT 2027: what we know and how to start in November" hub. Ship the free mock + percentile. Begin a solved-question series. Join 5 FB groups + Reddit, answers only. Remove every claim the code doesn't support | Emails captured — **300** |
| 15–45 | 20 short-form question videos. 60 worked-solution pages. Recruit 3–5 2026 admits as 35% affiliates. Resit offer to 2026 non-placers via groups. Pitch 10 agencies | Free mocks completed — **500** |
| 46–75 | First paid cohort: lifetime at an intro price to the warm list only. Publish 5 named results. WhatsApp broadcast. One long-form "my 8-month IMAT plan" | Paying users — **25–40** |
| 76–90 | Kill formats under 1% CTR, double the top two. Pre-write the decree-day template | Revenue — **€1.5–2.5K** |

**Five things must exist before any promotion; everything else is a post-exam luxury:** mock + percentile, solved past-paper bank, email capture and drip, a working payment link, refund/terms page.

---

## 5. Revenue

The original projection assumed 50–100 paying monthly users within three months at €12/mo. Keep the arithmetic, replace the assumptions:

| Paying users | Plan | Monthly revenue |
|---|---|---|
| 50 | Monthly €12 | €600 |
| 100 | Monthly €12 | €1,200 |
| 200 | Monthly €12 | €2,400 |
| 100 | Yearly €79 | ~€658 average |

**Corrections to plan against:** monthly subscribers churn at ~38%/yr and every user has ~11 months of shelf life, so monthly LTV caps near €100 anyway. **Push €79/yr and €149 lifetime hard; treat €12/mo as an on-ramp**, shown with a visible "save €65 annually" nudge. A 3% paid share of a single year's 18,368 candidates is roughly €40K/yr — that is the shape of this ceiling, not a failure of effort.

---

## 6. Build priorities

| # | Work | Est. | Why now |
|---|---|---|---|
| 1 | Stripe Checkout route + webhook writing `subscriptionStatus` / `subscriptionEnd`; real `/pricing`; entitlement read fresh from the DB | 2–3 days | Without it there is no business, only a hobby. Also move `new Stripe()` out of module scope |
| 2 | Stop sending `correctAnswer` / `explanation` before grading; return explanations only from `/submit` and in review mode. Move locked PDFs out of `public/` behind an authenticated/signed route | 1 day | Trust and the integrity of the paywall |
| 3 | Fix broken surface: 2020–2022 rows with no files, model papers as year "9001" with empty `pdfUrl`, the `/dashboard/pricing` 404, the `/planner` middleware matcher. Delete or build — no half-states | 1 day | Broken links read as an abandoned product |
| 4 | Rewrite all copy to match reality (README ✅, landing page, pricing page) | 0.5 day | In this market a false claim becomes a screenshot on Reddit |
| 5 | **Free mock + percentile engine** with the official 2026 distribution baked in, and a shareable result card | 3–4 days | The funnel product |
| 6 | Question bank: 200 → ~600 genuinely sourced, solved, explained questions covering official papers. Transcribe from official MUR papers; do **not** copy competitor-written solutions | Ongoing — this is the moat | Depth beats breadth against 5,600-question incumbents |
| 7 | Email capture gating the PDF download + 5-message calendar drip | 1 day | Compounding asset |
| 8 | Deploy hygiene: commit `prisma/migrations`, CI with typecheck/lint/test, `sitemap`/`robots`/structured data, rate-limit auth routes, remove `any` on Prisma `where` clauses, delete dead `QuizEngine.tsx`, add `loading`/`error` boundaries | 2 days | Cheap now, expensive later |
| 9 | Make exam year, dates, duration, section weights and scoring **config-driven** | 1 day | The 2027 decree will force a change; whoever updates fastest wins the season |
| 10 | Analytics dashboard → study planner → dark mode → forum | Later | Sell first, build only what sells |

---

## 7. Risks we are carrying

1. **Regulatory whiplash.** Format, name and dates are re-decided annually by decree; the 2027 decree does not exist yet. Mitigation: config layer (§6 item 9) + a marketing calendar that assumes an August announcement.
2. **No content moat at 200 questions.** Mitigation: percentile calibration, sourcing transparency, seasonal speed.
3. **Pava Test could add a €12 tier** and squeeze the gap we're aiming at. Move first.
4. **Trust deficit** is the actual conversion barrier — not price.
5. **Market size.** Plan the cost structure for a €40–80K/yr solo business unless something proves otherwise.

---

## Sources

MUR Decree 1005 (6 Aug 2026) · Universitaly IMAT · the official MUR paper archive (accessoprogrammato.mur.gov.it) · italymedicalschools.com (results, admission tests, IMAT 2027) · studyu.org · applyaz.com · imatbuddy.com · test.pavaedu.com · entermedschool.com · imatmentor.com · medschool.it · acadimat.com · meditaliano.com · med-study-imat-courses.com · accademiaditaliano.it · thisislocomotive.com · imatprep.in · imatify.site · reddit.com/r/StudyInItaly · facebook.com/groups/imatexam · tiktok.com/@pathwayitalia · recurly.com churn benchmarks · firstpagesage.com & userpilot.com freemium conversion · ahrefs.com ranking-age study · superads.ai Italy Meta CPM · theadspend.com education search CPC · flywire.com education-agent commission

Full research with URLs and as-of dates: [`docs/RESEARCH.md`](RESEARCH.md). **Verified:** competitor prices, exam dates, candidate counts, community sizes (read 2026-11-01/02). **Not verified:** keyword search volumes (no Ahrefs/Keyword Planner access), EnterMedSchool's €199 (search snippet only), candidate nationality breakdown (unpublished). The TAM ceiling, cluster analysis and CAC math are inference, not published fact.
