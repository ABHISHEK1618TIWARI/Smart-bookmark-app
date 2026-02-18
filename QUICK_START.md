# Quick Start Guide

Get the Smart Bookmark App running in 5 minutes!

## 1️⃣ Install Dependencies
```bash
npm install
```

## 2️⃣ Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Create free project
- Note Project URL and Anon Key

## 3️⃣ Configure Environment
```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## 4️⃣ Setup Database
1. In Supabase SQL Editor, run contents of `DATABASE_SCHEMA.sql`
2. Configure Google OAuth in Supabase Authentication

## 5️⃣ Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🎉 Done!
- Sign in with Google
- Start adding bookmarks
- Watch them sync in real-time!

---

**Need help?** See [README.md](./README.md) for detailed documentation.
