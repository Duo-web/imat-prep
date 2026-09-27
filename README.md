# 🎓 IMAT Prep Platform

> A modern, affordable, and feature-rich IMAT exam preparation platform built for students who want to study Medicine and Dentistry at public universities in Italy.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-In%20Development-orange.svg)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Node.js%20%7C%20PostgreSQL-green.svg)

---

## 📌 What is IMAT?

The **IMAT (International Medical Admissions Test)** is the entrance exam required to study Medicine or Dentistry at public universities in Italy, taught in English. It covers:

| Section | What it tests | Questions |
|---|---|---|
| Reading Skills & General Knowledge | Text analysis, grammar, general knowledge | 4 questions |
| Logical Reasoning & Problem Solving | Data analysis, critical thinking, inference | 5 questions |
| Scientific Knowledge | Biology, Chemistry, Physics, Maths | 51 questions |

---

## 🚀 What is this Platform?

This platform is a **smarter, cheaper, and more modern** alternative to existing IMAT prep websites. It provides students with everything they need to prepare for the IMAT exam — from free past papers to adaptive practice quizzes, performance analytics, and personalized study planners.

---

## ✅ Features

### Free (No account needed)
- 📄 Download all IMAT past papers (2015–2025) as free PDFs
- 🧠 10 practice questions per day
- 📰 IMAT news and exam date updates

### Premium (Subscription)
- ♾️ Unlimited practice questions with worked solutions
- 🧪 30+ full exam simulators with timer
- 📊 Performance dashboard and analytics
- 📅 Personalized study planner (based on your exam date)
- 📈 Track progress over time with charts
- 🔍 Section-wise breakdown (Biology, Chemistry, Physics, Maths, Logic)
- 💬 Community forum per question
- 🌙 Dark mode
- 📱 Mobile optimized

---

## 💰 Pricing

| Plan | Price | What you get |
|---|---|---|
| **Free** | €0 | Past paper PDFs, 10 questions/day |
| **Monthly** | €12/month | Unlimited questions, simulators, worked solutions, dashboard |
| **Yearly** | €79/year | Everything in monthly + study planner, analytics, priority support |
| **Lifetime** | €149 one-time | Everything forever, no renewals |

### Why cheaper than the competition?
> The leading IMAT prep platform charges **€279/year** with no monthly option and no free trial.
> We charge **€79/year** with a built-in free tier — that's **3.5x cheaper** with more features.

---

## 🗺️ 2-Week Development Roadmap

### Week 1 — Foundation & Core Features

| Day | Task |
|---|---|
| Day 1 | Project setup, GitHub repo, Next.js init, PostgreSQL, deploy to Vercel |
| Day 2 | Authentication system (register, login, logout, JWT, protected routes) |
| Day 3 | Database schema design (users, papers, questions, attempts, sessions) |
| Day 4 | Past papers section (upload PDFs, listing page, download, free vs locked) |
| Day 5 | Question bank & quiz engine (MCQ interface, timer, instant result, store attempts) |
| Day 6 | Practice mode & exam simulator (practice vs full exam mode, section filters) |
| Day 7 | Bug fixes, mobile testing, Week 1 review |

### Week 2 — Advanced Features & Launch

| Day | Task |
|---|---|
| Day 8 | User dashboard (attempts, scores, weak topics, activity feed, streak) |
| Day 9 | Performance analytics (charts, section breakdown, compare vs average) |
| Day 10 | Stripe payments (free/monthly/yearly/lifetime plans, auto-unlock premium) |
| Day 11 | Study planner (exam date input, day-by-day plan, topic checklist) |
| Day 12 | UI polish (dark mode, animations, mobile optimization, loading states) |
| Day 13 | Full testing & security checks (auth, SQL injection, XSS, all user flows) |
| Day 14 | Launch (domain, analytics, FAQ, share on Reddit/Facebook/WhatsApp) 🚀 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes / Node.js |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth.js |
| Payments | Stripe |
| PDF Storage | Cloudflare R2 |
| Video Hosting | Bunny.net |
| Deployment | Vercel |
| Mobile | Mobile-first responsive (PWA later) |

---

## 🗄️ Database Schema

```
users
  - id, name, email, password, subscription_status, created_at

papers
  - id, year, title, pdf_url, is_free

questions
  - id, paper_id, section, question_text, option_a/b/c/d/e, correct_answer, explanation

attempts
  - id, user_id, question_id, selected_answer, is_correct, time_taken, created_at

sessions
  - id, user_id, paper_id, score, total_questions, date
```

---

## 📁 Project Structure

```
imat-prep/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── papers/
│   ├── quiz/
│   ├── simulator/
│   ├── planner/
│   └── api/
├── components/
│   ├── ui/
│   ├── quiz/
│   ├── dashboard/
│   └── layout/
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   └── stripe.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── papers/
└── README.md
```

---

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL or Supabase account
- Stripe account
- Cloudflare account (for PDF storage)

### Installation

```bash
# Clone the repo
git clone https://github.com/Duo-web/imat-prep.git
cd imat-prep

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your values (database URL, Stripe keys, auth secret)

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=your_postgresql_url

# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare R2 (PDF Storage)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_ACCESS_KEY=
CLOUDFLARE_SECRET_KEY=
CLOUDFLARE_BUCKET_NAME=
```

---

## 📈 Revenue Projections

| Paying Users | Plan | Monthly Revenue |
|---|---|---|
| 50 users | Monthly €12 | €600/month |
| 100 users | Monthly €12 | €1,200/month |
| 200 users | Monthly €12 | €2,400/month |
| 100 users | Yearly €79 | ~€658/month avg |

**Realistic target after 3 months:** 50–100 paying users = **€600–€1,200/month**

---

## 📣 Marketing Plan

- 📌 Post on **Reddit** — r/IMAT, r/medicine, r/studyabroad
- 👥 Join **Facebook groups** for IMAT students
- 🎵 **TikTok/Instagram** — "I built a free IMAT prep site"
- 💬 Share in **WhatsApp groups** of IMAT students
- 🎁 Offer **free lifetime access** to first 50 users for honest reviews
- 🔍 **SEO blog posts** targeting: "IMAT past papers free", "IMAT 2026 preparation", "study medicine Italy"

---

## 🆚 Comparison with IMAT Buddy

| Feature | IMAT Buddy | This Platform |
|---|---|---|
| Free past papers | ✅ | ✅ |
| Free practice questions | ❌ | ✅ (10/day) |
| Monthly plan | ❌ | ✅ €12/month |
| Yearly plan | €279 | ✅ €79/year |
| Lifetime plan | ❌ | ✅ €149 |
| Free trial | ❌ | ✅ Built-in free tier |
| Performance analytics | ❌ | ✅ |
| Adaptive quizzes | ❌ | ✅ |
| Study planner | Basic | ✅ Smart planner |
| Dark mode | ❌ | ✅ |
| Mobile app | ❌ | ✅ PWA |
| Community forum | Basic | ✅ Per-question forum |

---

## 🧱 Development Rules

1. **Mobile first** — majority of students use phones
2. **Ship daily** — push working code every day
3. **Keep it simple** — stick to the roadmap, no scope creep
4. **Test as you build** — don't leave all testing to the last day
5. **Security first** — hash passwords, validate inputs, sanitize queries

---

## 📋 What's Needed to Start

| Item | When needed |
|---|---|
| Past paper PDFs (2015–2025) | Day 4 |
| Answer keys | Day 5 |
| Domain name | Day 13 |
| Stripe account (free to create) | Day 10 |
| Supabase account (free tier) | Day 1 |

---

## 🤝 Contributing

This project is currently in private development. Contribution guidelines will be added after the initial launch.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 📬 Contact

For questions, partnerships, or feedback — open an issue or reach out via the platform's contact page once live.

---

> Built with ❤️ to make IMAT preparation accessible and affordable for every student worldwide.
