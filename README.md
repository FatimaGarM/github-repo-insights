# GitHub Repo Insights

A web application that analyzes any GitHub repository and displays key metrics: stars, forks, contributors, language distribution, commit activity, and a calculated health score.

## Features

- **Repository search** — Enter any `owner/repo` slug or full GitHub URL
- **Stats overview** — Stars, forks, watchers, open issues at a glance
- **Top contributors** — Avatar, username and commit count (links to their profile)
- **Language breakdown** — Interactive pie chart with percentages
- **Commit activity** — Line chart of weekly commits over the last year
- **Health score** — Calculated score (0-100) based on activity, contributors and popularity
- **Recent repos** — Last 5 searched repos saved in localStorage
- **Loading skeleton** — Smooth loading state with animated placeholders
- **Error handling** — Friendly error page with retry and go-home options

## Tech Stack

- **Next.js 16** — App Router, Server Components, ISR caching
- **React 19**
- **TypeScript** — Strict mode, typed interfaces
- **Tailwind CSS 4**
- **Recharts** — Line and Pie charts
- **GitHub REST API** — Unauthenticated (60 req/hour)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (search + recent repos)
│   ├── globals.css         # Global styles
│   └── repo/
│       └── [owner]/
│           └── [repo]/
│               ├── page.tsx     # Repo analysis page (Server Component)
│               ├── loading.tsx  # Loading skeleton
│               └── error.tsx    # Error boundary
├── components/
│   ├── CommitChart.tsx     # Weekly commit line chart
│   └── LanguageChart.tsx   # Language distribution pie chart
└── lib/
    ├── github.ts           # GitHub API functions + TypeScript interfaces
    └── healthScore.ts      # Health score calculation
```

## Deploy

Deploy to [Vercel](https://vercel.com) with one click — no configuration needed.

## License

MIT
