# Setup Checklist - Smart Bookmark App

Complete setup checklist before running the app and deploying to production.

## Phase 1: Local Development Setup

### 1.1 Prerequisites
- [ ] Node.js 18+ LTS installed (`node -v` should show v18+)
- [ ] npm 9+ installed (`npm -v` should show v9+)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)
- [ ] GitHub account created
- [ ] Supabase account created (free tier works)
- [ ] Google Cloud account created

### 1.2 Project Setup
- [ ] Navigated to project folder
- [ ] Ran `npm install` successfully
- [ ] All dependencies installed without errors
- [ ] Created `.env.local` from `.env.local.example`
- [ ] `package.json` has all required dependencies
- [ ] `tsconfig.json` properly configured
- [ ] `next.config.js` present

### 1.3 File Structure
- [ ] `app/page.tsx` (Login page) ✅
- [ ] `app/layout.tsx` (Root layout) ✅
- [ ] `app/globals.css` (Global styles) ✅
- [ ] `app/auth/callback/route.ts` (OAuth handler) ✅
- [ ] `app/dashboard/layout.tsx` (Protected wrapper) ✅
- [ ] `app/dashboard/page.tsx` (Dashboard) ✅
- [ ] `components/Header.tsx` ✅
- [ ] `components/BookmarkForm.tsx` ✅
- [ ] `components/BookmarkList.tsx` ✅
- [ ] `lib/supabaseClient.ts` ✅

---

## Phase 2: Supabase Configuration

### 2.1 Create Supabase Project
- [ ] Visit [supabase.com](https://supabase.com)
- [ ] Signed in / created account
- [ ] Created new project
- [ ] Saved project credentials:
  - Project ID: ________________
  - Project URL: ________________
  - Anon Key: ________________
- [ ] Waited for project to initialize (2-3 minutes)

### 2.2 Database Schema Setup
- [ ] Opened Supabase SQL Editor
- [ ] Created new query
- [ ] Copied `DATABASE_SCHEMA.sql` contents
- [ ] Pasted into Supabase editor
- [ ] Executed query (no errors)
- [ ] Verified bookmarks table created:
  - [ ] Table name: `bookmarks`
  - [ ] Columns: id, user_id, title, url, created_at
  - [ ] Indexes: 3 indexes created
  - [ ] RLS: Enabled
  - [ ] Policies: 4 policies created

### 2.3 Verify Database
- [ ] Ran test query: `SELECT * FROM bookmarks LIMIT 1;`
- [ ] Got "no rows" result (empty table is correct)
- [ ] Checked RLS status: ENABLED
- [ ] Checked Realtime: ENABLED (Extensions → Realtime)

### 2.4 Authentication Setup
- [ ] Went to Authentication → Settings
- [ ] Checked "Enable Email Auth" is OFF (optional, we use Google only)
- [ ] Noted down Supabase Auth URL

---

## Phase 3: Google OAuth Configuration

### 3.1 Google Cloud Project
- [ ] Visited [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Created new project (or selected existing)
- [ ] Project name set: `Smart Bookmark App`
- [ ] Enabled "Google+ API" (allow 2-3 minutes)

### 3.2 Get OAuth Credentials
- [ ] Opened Credentials page
- [ ] Clicked "Create Credentials" → "OAuth Client ID"
- [ ] Selected "Web Application"
- [ ] Created OAuth credentials
- [ ] Added Authorized JavaScript Origins:
  - [ ] `http://localhost:3000`
  - [ ] `http://localhost:3001` (alternative)
- [ ] Added Authorized Redirect URIs:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `http://localhost:3001/auth/callback` (if using alt port)
- [ ] Saved credentials:
  - Client ID: ________________
  - Client Secret: ________________

💡 *Note*: Will add Vercel domains next (after initial deployment)

### 3.3 Configure OAuth in Supabase
- [ ] Went to Supabase Dashboard
- [ ] Navigated to Authentication → Providers
- [ ] Found "Google" provider
- [ ] Clicked to configure
- [ ] Entered credentials:
  - [ ] Client ID: (from Google Cloud)
  - [ ] Client Secret: (from Google Cloud)
- [ ] Enabled provider (toggle ON)
- [ ] Saved configuration

### 3.4 Test Google OAuth Locally
- [ ] Environment variables configured in `.env.local`
- [ ] Ran `npm run dev`
- [ ] Clicked "Sign in with Google"
- [ ] Popup appeared without errors
- [ ] Authorized app access
- [ ] Redirected to dashboard successfully
- [ ] Saw user email in header

---

## Phase 4: Environment Variables

### 4.1 Configure Local Development
- [ ] Created `.env.local` file in project root
- [ ] Added NEXT_PUBLIC_SUPABASE_URL:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
  ```
  (Replace [project-id] with actual project ID)
- [ ] Added NEXT_PUBLIC_SUPABASE_ANON_KEY:
  ```
  NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
  ```
  (From Supabase Settings → API)
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] No sensitive keys exposed in code

### 4.2 Verify Environment Variables
- [ ] Ran `npm run dev`
- [ ] No error about missing environment variables
- [ ] App loads without errors
- [ ] Console shows no undefined variables

---

## Phase 5: Feature Testing

### 5.1 Authentication Flow
- [ ] Visited `http://localhost:3000`
- [ ] Saw login page with "Sign in with Google" button
- [ ] Clicked button (popup appeared)
- [ ] Completed OAuth flow
- [ ] Redirected to dashboard
- [ ] User info displayed in header
- [ ] Refreshed page (session persisted)
- [ ] Still logged in ✅

### 5.2 Add Bookmark Feature
- [ ] Filled in bookmark title: "Test Title"
- [ ] Filled in bookmark URL: `https://example.com`
- [ ] Clicked "Add Bookmark"
- [ ] Saw success message
- [ ] Form cleared
- [ ] Bookmark appeared in list
- [ ] Check database: bookmark saved

### 5.3 List Bookmarks
- [ ] Bookmark displayed with title and URL
- [ ] URL domain shown correctly
- [ ] Created timestamp shown (relative time)
- [ ] Bookmarks sorted by newest first
- [ ] Multiple bookmarks tested (added 5+)
- [ ] All bookmarks displayed
- [ ] Pagination/scrolling works if needed

### 5.4 Delete Bookmark
- [ ] Hovered over bookmark
- [ ] Saw delete button (trash icon)
- [ ] Clicked delete button
- [ ] Bookmark removed from list
- [ ] Database updated (verified in SQL)
- [ ] Empty state message appears when all deleted

### 5.5 Real-Time Synchronization
- [ ] Opened app in two tabs (Tab 1 and Tab 2)
- [ ] Added bookmark in Tab 1
- [ ] Watched Tab 2 (should update instantly)
- [ ] Tab 2 shows new bookmark WITHOUT refresh ✅
- [ ] Added bookmark in Tab 2
- [ ] Tab 1 updated in real-time ✅
- [ ] Deleted bookmark in Tab 1
- [ ] Tab 2 reflects deletion instantly ✅

### 5.6 Logout
- [ ] Clicked "Logout" button
- [ ] Redirected to login page
- [ ] Session cleared (console verification)
- [ ] Cannot access `/dashboard` (redirected to /)
- [ ] Logged back in successfully

### 5.7 Error Handling
- [ ] Entered invalid URL (no http://): got error message ✅
- [ ] Left title empty: got error message ✅
- [ ] Tried bookmark url without protocol: got error ✅
- [ ] Network error handling tested (todo: manual throttle)
- [ ] Error messages user-friendly

### 5.8 Loading States
- [ ] Slow network simulation (DevTools throttle)
- [ ] Add button shows loading state
- [ ] Dashboard shows loading spinner while fetching
- [ ] Delete button shows loading during deletion
- [ ] No duplicate submissions possible
- [ ] Buttons disabled during loading

---

## Phase 6: Build & Deployment Prep

### 6.1 Production Build
- [ ] Ran `npm run build` successfully
- [ ] No TypeScript errors found
- [ ] No ESLint warnings
- [ ] Build completed without errors
- [ ] `.next` folder created

### 6.2 Test Production Build
- [ ] Ran `npm start`
- [ ] Visited `http://localhost:3000`
- [ ] All features work same as dev
- [ ] No console errors
- [ ] Performance seems good

### 6.3 Code Quality
- [ ] Ran `npm run lint`
- [ ] No critical issues found
- [ ] ESLint warnings reviewed
- [ ] Code follows Next.js best practices
- [ ] TypeScript strict mode enabled

### 6.4 Git Repository
- [ ] Initialized git: `git init`
- [ ] Added all files: `git add .`
- [ ] Created commit: `git commit -m "Initial commit"`
- [ ] Created main branch: `git branch -M main`
- [ ] Added remote: `git remote add origin [GitHub URL]`
- [ ] Pushed to GitHub: `git push -u origin main`
- [ ] Verified on GitHub:
  - [ ] All files present
  - [ ] `.env.local` NOT in repo (in .gitignore)
  - [ ] `node_modules` NOT in repo

### 6.5 Code Documentation
- [ ] README.md complete and accurate ✅
- [ ] DEPLOYMENT.md step-by-step ✅
- [ ] DATABASE_SCHEMA.sql documented ✅
- [ ] QUICK_START.md ready ✅
- [ ] TROUBLESHOOTING.md available ✅
- [ ] Code comments where needed

---

## Phase 7: Vercel Deployment

### 7.1 Prepare Vercel
- [ ] Created Vercel account
- [ ] Connected GitHub account to Vercel
- [ ] Authorized Vercel to access repositories

### 7.2 Deploy Project
- [ ] Visited [vercel.com](https://vercel.com)
- [ ] Clicked "New Project"
- [ ] Selected GitHub repository
- [ ] Vercel detected Next.js framework
- [ ] Build settings look correct:
  - Build Command: `next build`
  - Output Directory: `.next`
  - Install Command: `npm install`
- [ ] Added environment variables:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Set for all environments: Production, Preview, Development
- [ ] Clicked "Deploy"
- [ ] Deployment completed successfully
- [ ] Got Vercel deployment URL:
  URL: ________________________________________________

### 7.3 Verify Deployed App
- [ ] Visited Vercel deployment URL
- [ ] Saw login page (no errors)
- [ ] Google OAuth button working
- [ ] Clicked login (OAuth popup appeared)
- [ ] Completed OAuth flow
- [ ] Redirected to dashboard
- [ ] Can add bookmarks
- [ ] Real-time sync works
- [ ] Can delete bookmarks
- [ ] Can logout

### 7.4 Update OAuth Credentials
- [ ] Got Vercel deployment domain:
  Domain: ________________________________________________
- [ ] Added to Google Cloud Console:
  - Authorized JavaScript Origins: `https://[domain]`
  - Authorized Redirect URIs: `https://[domain]/auth/callback`
- [ ] Updated Supabase (if changed):
  - Google provider settings (if needed)

### 7.5 Custom Domain (Optional)
- [ ] Purchased custom domain (optional)
- [ ] Added to Vercel project
- [ ] Configured DNS records
- [ ] Verified domain works
- [ ] Added custom domain to OAuth if used

---

## Phase 8: Final Testing on Production

### 8.1 Authentication
- [ ] Logged in via deployed URL
- [ ] Session persists on page refresh
- [ ] Logout works
- [ ] OAuth flow smooth

### 8.2 All Features
- [ ] Add bookmark works
- [ ] List displays correctly
- [ ] Delete bookmark works
- [ ] Real-time sync working (open 2 tabs on deployment)

### 8.3 Performance
- [ ] Page loads quickly
- [ ] No console errors
- [ ] Lighthouse score acceptable:
  - Performance: > 75
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

### 8.4 Mobile Testing
- [ ] Responsive on mobile (iPhone, Android)
- [ ] Login works on mobile
- [ ] Bookmarks display correctly
- [ ] Can add/delete on mobile
- [ ] Touch interactions work

---

## Phase 9: Security Review

### 9.1 Authentication Security
- [ ] Only Google OAuth enabled (no email/password)
- [ ] Passwords not stored anywhere
- [ ] Sessions handled by Supabase
- [ ] No sensitive data in localStorage

### 9.2 Database Security
- [ ] RLS policies enabled
- [ ] Users can only access own bookmarks
- [ ] No SELECT * on public tables
- [ ] Foreign key constraints working
- [ ] No SQL injection possible

### 9.3 Code Security
- [ ] No API keys in code or comments
- [ ] `.env.local` in `.gitignore`
- [ ] No console.log of sensitive data
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] No dependencies with known vulnerabilities:
  ```bash
  npm audit
  # Should show no critical issues
  ```

### 9.4 Environment Security
- [ ] NEXT_PUBLIC_* variables safe for public
- [ ] ANON_KEY scoped to app usage only
- [ ] No private/service keys exposed
- [ ] Vercel environment variables encrypted

---

## Phase 10: Launch Checklist

### 10.1 Before Going Live
- [ ] All tests passed ✅
- [ ] Database schema correct ✅
- [ ] Google OAuth working ✅
- [ ] Real-time sync verified ✅
- [ ] No console errors ✅
- [ ] Lighthouse scores good ✅
- [ ] Mobile responsive ✅
- [ ] Documentation complete ✅

### 10.2 Social Sharing
- [ ] README.md written
- [ ] GitHub repository public (optional)
- [ ] Vercel deployment shareable
- [ ] Demo video created (optional)
- [ ] Screenshots taken (optional)

### 10.3 Post-Launch
- [ ] Monitor Vercel logs for errors
- [ ] Check Supabase database growth
- [ ] Monitor auth usage
- [ ] Get user feedback
- [ ] Plan improvements
- [ ] Documentation updated as needed

---

## Troubleshooting Reference

If you get stuck at any point:

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Run verification script:
   ```bash
   # macOS/Linux
   bash verify-setup.sh
   
   # Windows
   verify-setup.bat
   ```
3. Check environment variables
4. Check browser console (F12)
5. Check Supabase logs and database
6. Check Vercel deployment logs

---

## Post-Launch Maintenance

### Weekly
- [ ] Monitor deployment logs
- [ ] Check Supabase metrics
- [ ] Test login flow manually

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Check security advisories: `npm audit`
- [ ] Review user feedback
- [ ] Plan improvements

### Quarterly
- [ ] Full security audit
- [ ] Performance optimization
- [ ] Update documentation
- [ ] Review tech debt

---

## Completion Status

- **Checklist Start Date**: ________________
- **Local Development Ready**: ________________
- **Supabase Configured**: ________________
- **Google OAuth Working**: ________________
- **All Features Tested**: ________________
- **Deployment Date**: ________________
- **Launch Date**: ________________

---

**Status**: Ready for Deployment ✅
**Last Updated**: February 2026

For questions, see [README.md](./README.md) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

Good luck! 🚀
