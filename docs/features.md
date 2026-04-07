---

# Stolio — New Features (v1.1)

This document outlines the new features added to Stolio since the initial release.

---

## 1. Portfolio Analytics

Track how your portfolio is performing over time.

### Features
- **View Count**: Total number of visits to your portfolio
- **Unique Referrers**: Count of different sources sending traffic
- **Daily Views Chart**: Visual chart showing daily view trends over the last 14 days
- **Period Selection**: View analytics for 7d, 30d, 90d, or 1y

### Technical Details
- New `ViewLog` model in database to track individual page views
- New API endpoint: `GET /api/portfolio/[id]/analytics?period=30d`
- Automatic view tracking when portfolio is loaded
- Dashboard analytics modal with visual charts

### Database Changes
```prisma
model ViewLog {
  id          String    @id @default(cuid())
  portfolioId String
  referrer    String?
  userAgent   String?
  createdAt   DateTime  @default(now())
}
```

---

## 2. OpenGraph / Social Sharing

Portfolios now include proper metadata for social sharing.

### Features
- Dynamic `title` with name and title
- `description` set to portfolio tagline
- `openGraph` tags for LinkedIn, Twitter, etc.

### Technical Details
- Updated `generateMetadata` in portfolio page
- Returns `Metadata` with `openGraph.type: 'profile'`

---

## 3. GitHub Auto-Sync

Pull your GitHub repositories directly into your portfolio.

### Features
- Fetch top 10 recent repositories from GitHub
- Display name, description, language, stars, forks
- Filter by username in edit page

### Technical Details
- New API endpoint: `GET /api/portfolio/[id]/github?username=yourname`
- Optional `GITHUB_TOKEN` in `.env` for higher rate limits
- Returns formatted repo data:
```json
{
  "repos": [
    {
      "name": "my-project",
      "description": "A cool project",
      "url": "https://github.com/...",
      "language": "TypeScript",
      "stars": 42,
      "forks": 5
    }
  ]
}
```

### Environment Variable
```
GITHUB_TOKEN=ghp_your_github_token
```

---

## 4. Light Mode Toggle

Users can now choose between light and dark themes.

### Features
- Toggle in portfolio creation flow (Step 2: Theme Selection)
- Two options: Light (sun icon) or Dark (moon icon)
- Stored as `themeMode` in database

### Technical Details
- Added `themeMode` field to Portfolio model
- Creation flow now passes `themeMode` to API
- Stored as `light` or `dark` in database

### Database Changes
```prisma
model Portfolio {
  // ...
  themeMode String @default("dark")
}
```

---

## 5. AI Chat Improvements

The AI Portfolio Twin now has better conversation context.

### Technical Details
- Chat history passed to AI for context-aware responses
- Maintains conversation flow across messages
- Fallback responses if AI fails

---

## New API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio/[id]/analytics` | GET | Fetch analytics data |
| `/api/portfolio/[id]/analytics` | POST | Log a view |
| `/api/portfolio/[id]/github` | GET | Fetch GitHub repos |

---

## New Dashboard Features

- Analytics button on each portfolio card
- Visual analytics modal with:
  - Total views card
  - Unique referrers card
  - Daily views bar chart

---

## Environment Variables (Updated)

Add these to your `.env`:

```bash
# GitHub (optional, for repo sync)
GITHUB_TOKEN=ghp_your_token

# Existing:
# DATABASE_URL
# JWT_SECRET
# OLLAMA_URL
# OPENROUTER_API_KEY
```

---

## Build Status

All features pass build and type checking. Run with:
```bash
npm run dev
```

---

*Last updated: April 2026*