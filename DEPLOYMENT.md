# Deployment Guide - Smart Bookmark App

Complete step-by-step guide to deploy the Smart Bookmark App on Vercel.

## Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Supabase account (free)
- [ ] Google Cloud project with OAuth credentials
- [ ] Project code pushed to GitHub

## Checklist: Pre-Deployment

- [ ] All environment variables configured in `.env.local`
- [ ] Database schema created in Supabase (run `DATABASE_SCHEMA.sql`)
- [ ] Google OAuth configured in Supabase
- [ ] RLS policies enabled and tested
- [ ] Code tested locally with `npm run dev`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] All files committed to git

## Step 1: Prepare GitHub Repository

If not already done:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Smart Bookmark App - Production Ready"

# Add remote (replace with your username)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git

# Push to GitHub
git push -u origin main
```

## Step 2: Supabase Configuration

### 2.1 Create Supabase Project
1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: `smart-bookmark`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your location
5. Wait for project to be created (2-3 minutes)

### 2.2 Get Credentials
1. Go to **Settings → API**
2. Note down:
   - **Project URL**: `https://[project-id].supabase.co`
   - **Anon Key**: Long string under "anon public"

### 2.3 Create Database Schema
1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) locally
4. Copy entire contents
5. Paste into Supabase SQL editor
6. Click **Run** (or Ctrl+Enter)
7. Verify success: Check **Tables** in sidebar → should see `bookmarks` table

### 2.4 Configure Google OAuth

#### Get Google Credentials
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to **Credentials** (left sidebar)
5. Click **Create Credentials → OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add Authorized JavaScript Origins:
   ```
   http://localhost:3000
   https://[your-vercel-domain].vercel.app
   ```
8. Add Authorized Redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://[your-vercel-domain].vercel.app/auth/callback
   ```
   (Note: Replace `[your-vercel-domain]` after you deploy - you'll do this later)
9. Save and copy:
   - Client ID
   - Client Secret

#### Configure in Supabase
1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find and click **Google**
3. Paste:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Click **Save**

## Step 3: Deploy on Vercel

### 3.1 Connect Vercel to GitHub
1. Visit [vercel.com](https://vercel.com)
2. Sign up with GitHub or log in
3. Click **New Project**
4. Click **Import Git Repository**
5. Find your `smart-bookmark-app` repository
6. Click **Import**

### 3.2 Configure Project Settings
1. **Project Name**: Keep as is or customize
2. **Framework Preset**: Should auto-detect "Next.js"
3. **Build Command**: Keep default (`next build`)
4. **Output Directory**: Keep default (`.next`)
5. **Install Command**: Keep default (`npm install`)

### 3.3 Set Environment Variables
1. Scroll to **Environment Variables** section
2. Add both variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://[project-id].supabase.co`

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your anon key from Supabase

3. Set for all environments (Production, Preview, Development)
4. Click **Add** for each variable

### 3.4 Deploy
1. Click **Deploy** button
2. Wait for deployment to complete (2-5 minutes)
3. Once done, you'll see your deployment URL:
   ```
   https://smart-bookmark-app-[random].vercel.app
   ```

## Step 4: Post-Deployment Configuration

### 4.1 Update Google OAuth Redirect URIs
1. Get your Vercel deployment URL (e.g., `https://smart-bookmark-app-xyz.vercel.app`)
2. Go to [Google Cloud Console](https://console.cloud.google.com)
3. Go to **Credentials → OAuth 2.0 Client ID** (Web application)
4. Add to **Authorized Redirect URIs**:
   ```
   https://[your-vercel-domain]/auth/callback
   ```
5. Make sure `http://localhost:3000/auth/callback` remains (for local development)
6. Save

### 4.2 Update Supabase Google Provider
1. In Supabase Dashboard, go to **Authentication → Providers → Google**
2. If you changed anything in Google Cloud, update credentials
3. Verify it's enabled (green toggle)

### 4.3 Test Deployment
1. Visit your Vercel deployment URL
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect to dashboard
5. Try adding a bookmark
6. Verify real-time sync (open in two tabs)
7. Test logout

## Step 5: Domain Setup (Optional)

To use a custom domain instead of `vercel.app`:

1. Go to Vercel Dashboard → **Settings → Domains**
2. Click **Add Domain**
3. Enter your domain
4. Follow DNS configuration instructions
5. Wait for DNS to propagate (5-48 hours)

## Monitoring & Maintenance

### Check Deployment Status
- Vercel Dashboard shows all deployments
- Click any deployment to view logs
- Check build logs if deployment fails

### Monitor Supabase
- **Authentication**: Check login activity in Auth tab
- **Database**: Monitor bookmarks table size
- **Realtime**: Verify WebSocket connections working
- **Logs**: Check for errors in Logs section

### Environment Variables
- Keep credentials secure
- Use Vercel's environment variables, not `.env.local`
- Never commit `.env.local` to GitHub

## Troubleshooting Deployment

### Build Fails on Vercel
**Error**: `npm ERR! 404 Not Found`
- Solution: Ensure all dependencies in `package.json` are correct
- Try: `npm install` locally and verify it works

**Error**: `TypeScript error: Cannot find module`
- Solution: Check `tsconfig.json` paths
- Verify all imports use correct relative paths

### Google OAuth Not Working
**Issue**: "Invalid redirect URI"
- Solution: Check redirect URIs match exactly in both:
  - Google Cloud Console
  - Supabase Google Provider
  - Your code (`/auth/callback`)

**Issue**: OAuth popup closes with no error
- Solution: Check browser console for CORS errors
- Verify domain is authorized in Google credentials

### Bookmarks Not Saving
**Issue**: Adding bookmark doesn't work
- Solution: Check Supabase RLS policies in `DATABASE_SCHEMA.sql`
- Verify: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check browser console for API errors

**Issue**: Real-time updates not working
- Solution: Verify RLS policies allow SELECT
- Check that `auth.uid()` matches `user_id` in bookmarks

### Environment Variables Not Loading
**Issue**: "Missing Supabase environment variables"
- Solution: In Vercel, go to **Settings → Environment Variables**
- Verify variables are set for **Production** environment
- Redeploy after changing variables

## Performance Optimization

### Database Optimization
- Indexes already created on `user_id` and `created_at`
- RLS policies optimized for performance

### Frontend Optimization
- Next.js 14 handles automatic code splitting
- Tailwind CSS minified in production
- Images optimized automatically

### Monitoring Performance
- Vercel Insights shows Core Web Vitals
- Use Lighthouse in Chrome DevTools
- Monitor Supabase query performance

## Security Checklist

- [ ] Environment variables never exposed in code
- [ ] RLS policies properly configured
- [ ] Google OAuth using HTTPS only
- [ ] Database backups enabled (Supabase auto-backups)
- [ ] Vercel HTTPS enabled (automatic)
- [ ] Rate limiting configured (optional, in Supabase)

## Rollback Procedure

If something goes wrong:

### Quick Rollback on Vercel
1. Go to Vercel Dashboard
2. Find previous working deployment
3. Click **Promote to Production**
4. Previous version is now live

### Manual Rollback
1. Go to GitHub
2. Find previous working commit
3. Create new branch: `git checkout [previous-commit-hash]`
4. Push to deploy: `git push`

## Scaling in the Future

### When You Need to Scale
- Vercel Pro for advanced analytics and deployment priority
- Supabase purchased plan for higher limits
- Add caching layer (Vercel ISR/Edge Caching)
- Monitor database growth

### Upgrading Supabase Plan
1. Go to Supabase Dashboard → **Billing**
2. Choose appropriate plan
3. Upgrade (no downtime)

## Getting Help

### Vercel Support
- [Vercel Docs](https://vercel.com/docs)
- [Vercel GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Supabase Support
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

### Next.js Support
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

**Deployment Status**: Ready to Deploy ✅
**Last Updated**: February 2026

For detailed configuration, refer to main [README.md](./README.md)
