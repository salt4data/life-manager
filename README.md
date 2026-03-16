# 🌿 Personal Life Manager

Welcome to my productivity app for managing **tasks**, **goals**, **work items / projects**, and **reminders** — deployed on **Vercel** with a **Supabase** Postgres backend.

- ✅ Single-user, no authentication required
- 🔒 All database access happens server-side (service role key never exposed to browser)
- ⚡ Static HTML frontend + Vercel Serverless Functions

---

## Architecture

```
index.html          ← Static frontend served by Vercel
  ↕ fetch /api/*
api/data.js         ← GET all data (tasks + goals + jobs)
api/tasks.js        ← CRUD for tasks
api/goals.js        ← CRUD for goals
api/jobs.js         ← CRUD for work items
api/reset.js        ← POST to wipe all data
api/_supabase.js    ← Shared Supabase client (service role)
```

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/)
- A [Supabase](https://supabase.com/) project (free tier works)
- A [Vercel](https://vercel.com/) account (free tier works)

---

## 1. Supabase Setup

### 1a. Create a project

1. Go to [app.supabase.com](https://app.supabase.com/) and create a new project.
2. Note down:
   - **Project URL** → e.g. `https://xyzxyz.supabase.co`
   - **Service Role Key** → found under **Settings → API → service_role** (the `secret` key)

### 1b. Run the schema

1. In your Supabase dashboard, go to **SQL Editor**.
2. Paste the contents of [`schema.sql`](./schema.sql) and click **Run**.
3. This creates the `tasks`, `goals`, and `jobs` tables with indexes and RLS policies.

---

## 2. Environment Variables

You need two environment variables (set them in Vercel **and** locally):

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL (e.g. `https://xyzxyz.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | The **service_role** secret key from Supabase Settings → API |

> ⚠️ **Never** commit these values to version control. The service role key bypasses RLS and has full access.

---

## 3. Deploy to Vercel

### Option A: One-click deploy

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. In the Vercel project settings, add the two environment variables above.
4. Deploy. Done! 🎉

### Option B: Vercel CLI

```bash
npm i -g vercel
cd refactored_app
vercel login
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel --prod
```

---

## 4. Local Development

```bash
# Clone and install
cd refactored_app
npm install

# Create a .env file (never commit this!)
cat > .env <<EOF
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-key
EOF

# Start local dev server (Vercel CLI)
npx vercel dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

All endpoints accept/return JSON.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/data` | Fetch all tasks, goals, and jobs |
| `GET` | `/api/tasks` | List all tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks` | Update a task (requires `id` in body) |
| `DELETE` | `/api/tasks` | Delete a task (requires `id` in body) |
| `GET` | `/api/goals` | List all goals |
| `POST` | `/api/goals` | Create a goal |
| `PUT` | `/api/goals` | Update a goal (requires `id` in body) |
| `DELETE` | `/api/goals` | Delete a goal (requires `id` in body) |
| `GET` | `/api/jobs` | List all work items |
| `POST` | `/api/jobs` | Create a work item |
| `PUT` | `/api/jobs` | Update a work item (requires `id` in body) |
| `DELETE` | `/api/jobs` | Delete a work item (requires `id` in body) |
| `POST` | `/api/reset` | Delete **all** data from all tables |

---

## Project Structure

```
refactored_app/
├── index.html          # Static frontend (HTML + CSS + JS)
├── package.json        # Dependencies
├── vercel.json         # Vercel routing config
├── schema.sql          # Supabase database schema
├── README.md           # This file
└── api/
    ├── _supabase.js    # Shared Supabase client
    ├── data.js         # GET /api/data
    ├── tasks.js        # /api/tasks CRUD
    ├── goals.js        # /api/goals CRUD
    ├── jobs.js         # /api/jobs CRUD
    └── reset.js        # POST /api/reset
```

---

## License

MIT
