# Smart Bookmark App

A modern, production-ready bookmarking application built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Features real-time synchronization across devices and a sleek, dark-themed UI.

## Features

✨ **Core Features**
- 🔐 Google OAuth authentication
- 📑 Add, view, and delete bookmarks
- ⚡ Real-time synchronization (Supabase Realtime)
- 🔒 Secure with Row Level Security (RLS)
- 📱 Fully responsive design
- 🎨 Modern dark theme UI
- ⚙️ Production-ready code

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready
- **Authentication**: Google OAuth via Supabase

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Login page
│   ├── auth/
│   │   └── callback/route.ts   # OAuth callback handler
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout (protected)
│       └── page.tsx            # Dashboard page
├── components/
│   ├── Header.tsx              # Header with user profile
│   ├── BookmarkForm.tsx        # Add bookmark form
│   └── BookmarkList.tsx        # Display bookmarks list
├── lib/
│   └── supabaseClient.ts       # Supabase client config
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── DATABASE_SCHEMA.sql         # PostgreSQL schema
└── .env.local.example          # Environment template
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Supabase account (free tier available)
- Google OAuth credentials

### 1. Clone/Setup Project

```bash
# Navigate to project directory
cd smart-bookmark-app

# Install dependencies
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Note your project URL and anon key

#### Configure Google OAuth

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Click **Google**
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Create credentials: OAuth 2.0 → Web application
   - Authorized JavaScript origins: `http://localhost:3000` (dev), `your-vercel-domain.vercel.app` (prod)
   - Authorized redirect URIs: `http://localhost:3000/auth/callback`, `your-vercel-domain.vercel.app/auth/callback`
4. Copy Client ID and Client Secret into Supabase

#### Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor**
2. Create new query
3. Copy-paste contents of [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)
4. Run the query
5. Verify table created: Check **Tables** in left sidebar

### 3. Environment Variables

Create `.env.local` file in project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- `SUPABASE_URL`: Supabase Dashboard → Project Settings → API → Project URL
- `SUPABASE_ANON_KEY`: Supabase Dashboard → Project Settings → API → anon (public)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

## Usage

### Login
1. Click "Sign in with Google"
2. Complete Google OAuth flow
3. Get redirected to dashboard

### Add Bookmark
1. Enter bookmark title and URL
2. Click "Add Bookmark"
3. Bookmark appears instantly (real-time)

### View Bookmarks
- All bookmarks display in a list sorted by newest first
- Click any bookmark title to open in new tab
- Hover over bookmark to see delete button

### Delete Bookmark
- Hover over bookmark
- Click trash icon
- Bookmark removed instantly (real-time)

### Real-Time Sync
- Open same account in two different tabs
- Add/delete bookmark in one tab
- Watch it update instantly in other tab

### Logout
- Click "Logout" button in header
- Get redirected to login page
- Session cleared

## Database Schema

### bookmarks table
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- title: TEXT (required, non-empty)
- url: TEXT (required, non-empty)
- created_at: TIMESTAMP (default: now)
```

### Row Level Security (RLS) Policies
- ✅ Users can only **SELECT** their own bookmarks
- ✅ Users can only **INSERT** their own bookmarks
- ✅ Users can only **DELETE** their own bookmarks
- ✅ Users can only **UPDATE** their own bookmarks

## Deployment on Vercel

### Prerequisites
- GitHub account with repo
- Vercel account

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Smart Bookmark App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Add Environment Variables**
   - In Vercel dashboard, go to **Settings → Environment Variables**
   - Add:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Update Supabase OAuth Redirect URLs**
   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Add to Authorized Redirect URIs:
     ```
     https://your-vercel-deployment.vercel.app/auth/callback
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get live URL (e.g., `smart-bookmark-app-xyz.vercel.app`)

6. **Update Google OAuth Credentials** (if needed)
   - Add Vercel domain to Google Cloud Console OAuth consent screen

## Security Considerations

✅ **Implemented**
- All bookmarks protected with Row Level Security (RLS)
- Users can only access their own bookmarks
- Session tokens handled securely by Supabase
- HTTPS enforced in production
- No sensitive data in `NEXT_PUBLIC_*` variables is used for auth operations

⚠️ **Best Practices**
- Keep `.env.local` in `.gitignore` (already done)
- Use Vercel's environment variables for production secrets
- Regularly audit Supabase RLS policies
- Enable Vercel's security headers

## Performance Optimization

- ✅ Real-time sync with Supabase Realtime
- ✅ Optimized database queries with indexes
- ✅ Image optimization for favicons
- ✅ CSS minification with Tailwind
- ✅ Code splitting with Next.js
- ✅ Lazy loading of components

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` exists with correct values
- Restart development server: `npm run dev`
- Check spelling of env variable names

### Google login redirects to login page
- Verify Google OAuth credentials in Supabase
- Check redirect URI matches exactly
- Ensure cookies are enabled in browser

### Bookmarks not appearing after add
- Check browser console for errors
- Verify RLS policies are correctly applied
- Check user is authenticated: inspect `auth.uid()`

### Real-time updates not working
- Verify Supabase Realtime is enabled
- Check browser network tab for WebSocket connections
- Ensure user has SELECT permission via RLS

### Deployment issues on Vercel
- Check build logs in Vercel dashboard
- Ensure environment variables are set
- Verify Node.js version compatibility
- Check for TypeScript errors: `npm run build`

## Development

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

### Run Tests
```bash
# No tests included by default
# Add testing framework as needed: Jest, Vitest, Testing Library
```

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review Supabase documentation: [supabase.io/docs](https://supabase.io/docs)
3. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
4. Create issue on GitHub repository

## Roadmap

Potential future features:
- 📁 Organize bookmarks into categories
- 🔍 Search and filter functionality
- 🏷️ Add tags to bookmarks
- 🌙 Light/dark theme toggle
- 📊 Bookmark statistics dashboard
- 🔄 Import/export bookmarks
- 🤖 AI-powered bookmark suggestions
- 📲 Mobile app
- 👥 Share bookmarks with others
- 🎨 Custom themes

## Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Deployment platform

---

**Created**: February 2026
**Status**: Production Ready ✅
