# Troubleshooting Guide

Common issues and their solutions for Smart Bookmark App.

## Installation & Setup Issues

### Error: "npm ERR! code ERESOLVE"

**Problem**: Dependency conflict when running `npm install`

**Solution**:
```bash
# Try with legacy peer dependencies flag
npm install --legacy-peer-deps

# Or use npm v9+
npm install --force
```

### Error: "Cannot find module '@supabase/supabase-js'"

**Problem**: Supabase package not installed

**Solution**:
```bash
npm install @supabase/supabase-js
```

### Error: "next: command not found"

**Problem**: Next.js not installed or global

**Solution**:
```bash
# Install dependencies
npm install

# Or run with npm
npm run dev  # instead of next dev
```

### Error: ".env.local not found" during development

**Problem**: Environment variables file missing

**Solution**:
```bash
# Create from template
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local
# or use your editor
```

---

## Authentication Issues

### Login Button Not Working / OAuth Popup Doesn't Open

**Causes**:
- Google OAuth not configured in Supabase
- Redirect URI mismatch
- Browser popup blocked

**Solutions**:

1. **Check Google OAuth Configuration**
   ```
   Supabase Dashboard → Authentication → Providers → Google
   - Verify "Enabled" toggle is ON (green)
   - Check Client ID is entered
   - Check Client Secret is entered
   ```

2. **Verify Redirect URI**
   ```
   For localhost development:
   - Authorized Redirect URIs must include:
     http://localhost:3000/auth/callback
   
   For production (Vercel):
   - Add: https://[your-domain].vercel.app/auth/callback
   ```

3. **Allow Popups**
   - Check browser popup settings
   - Verify popups not blocked for localhost:3000
   - Try in incognito/private mode

4. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for CORS errors or OAuth errors
   - Share error message with support

### "Missing Supabase environment variables" Error

**Problem**: Environment variables not loading

**Solution**:
```bash
# Verify .env.local exists
ls .env.local  # macOS/Linux
dir .env.local # Windows

# Check file contents
cat .env.local

# Should show:
# NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Restart dev server
# Stop: Ctrl+C
# Start: npm run dev
```

### Logged In But Redirected to Login Page

**Problem**: Session not persisting

**Causes**:
- Cookie/localStorage disabled
- Supabase session expired
- Browser clearing cookies

**Solutions**:

1. **Check Browser Settings**
   - Ensure cookies enabled
   - Ensure localStorage enabled
   - Check browser not in strict privacy mode

2. **Check Supabase Session**
   ```javascript
   // In browser console:
   const { data: { session } } = await supabase.auth.getSession()
   console.log(session)
   // Should show user object, not null
   ```

3. **Clear and Retry**
   - Clear browser cache
   - Clear cookies for localhost:3000
   - Logout and login again

### "Invalid redirect URI" Error

**Problem**: OAuth redirect doesn't match configured URI

**Solution**:
1. Get your exact redirect URL:
   ```
   http://localhost:3000/auth/callback  (for local dev)
   https://[domain].vercel.app/auth/callback  (for production)
   ```

2. In Google Cloud Console:
   - Go to Credentials
   - Edit OAuth 2.0 Client
   - Verify "Authorized Redirect URIs" has exact URL
   - Spaces and protocol matter!

3. In Supabase:
   - Verify same URI in Google provider settings

---

## Database Issues

### Bookmarks Not Saving / "Error adding bookmark"

**Causes**:
- Database not created
- RLS policies blocking access
- Wrong database credentials

**Solutions**:

1. **Verify Database Schema**
   ```
   Supabase → SQL Editor
   Check that bookmarks table exists:
   - SELECT * FROM bookmarks LIMIT 1;
   - If error: run DATABASE_SCHEMA.sql
   ```

2. **Check RLS Policies**
   ```
   Supabase → Authentication → Policies
   bookmarks table should have 4 policies:
   ✅ Users can select their own bookmarks
   ✅ Users can insert their own bookmarks
   ✅ Users can delete their own bookmarks
   ✅ Users can update their own bookmarks
   ```

3. **Test with SQL**
   ```sql
   -- As authenticated user, test insert:
   INSERT INTO bookmarks (title, url, user_id)
   VALUES ('Test', 'https://example.com', auth.uid());
   
   -- If error: RLS policy issue
   -- Check: auth.uid() returns correct user ID
   ```

4. **Check Browser Console**
   ```javascript
   // In browser console, test Supabase:
   const { data, error } = await supabase
     .from('bookmarks')
     .insert([{ title: 'Test', url: 'https://example.com' }])
   console.log(error)  // Check error message
   ```

### "RLS policy violation" Error

**Problem**: User doesn't have permission to access data

**Solutions**:

1. **Verify Policy Syntax**
   ```sql
   -- Policy should use auth.uid()
   USING (auth.uid() = user_id)
   WITH CHECK (auth.uid() = user_id)
   ```

2. **Check User ID in Database**
   ```sql
   -- Verify user exists
   SELECT id, email FROM auth.users WHERE email = 'your@email.com';
   
   -- Check bookmarks belong to user
   SELECT * FROM bookmarks WHERE user_id = 'user-uuid';
   ```

3. **Test with SQL Editor (as user)**
   ```
   Switch to user role in Supabase SQL Editor
   Try basic query to verify RLS working
   ```

### Bookmarks Appear But Can't Delete

**Problem**: Delete button doesn't work / delete fails silently

**Solutions**:

1. **Check Delete Policy**
   ```sql
   -- Verify policy allows DELETE
   SELECT * FROM pg_policies 
   WHERE tablename = 'bookmarks' 
   AND policyname LIKE '%delete%';
   ```

2. **Test in Console**
   ```javascript
   const { error } = await supabase
     .from('bookmarks')
     .delete()
     .eq('id', 'bookmark-id')
   console.log(error)  // Check error
   ```

3. **Verify Bookmark Ownership**
   ```sql
   SELECT id, user_id FROM bookmarks 
   WHERE id = 'bookmark-id';
   -- user_id should match auth.uid()
   ```

### "Table doesn't exist" Error

**Problem**: PostgreSQL can't find bookmarks table

**Solution**:
1. Run DATABASE_SCHEMA.sql in Supabase SQL Editor:
   ```
   Supabase → SQL Editor → New Query
   Copy DATABASE_SCHEMA.sql content
   Click Run
   ```

2. Verify table created:
   ```
   Supabase → Tables (left sidebar)
   Should see: bookmarks table
   ```

---

## Real-Time Sync Issues

### Real-Time Updates Not Working Across Tabs

**Problem**: Changes in one tab don't appear in another tab

**Causes**:
- Realtime not enabled in Supabase
- Browser blocking WebSocket connections
- Network/firewall issue

**Solutions**:

1. **Enable Realtime in Supabase**
   ```
   Supabase → Database → Extensions
   Search: "Realtime"
   Should be ENABLED (check mark)
   ```

2. **Verify Subscription**
   ```javascript
   // In console on one tab:
   const subscription = supabase
     .channel('bookmarks')
     .on('postgres_changes', { event: '*', schema: 'public', table: 'bookmarks' }, 
       (payload) => console.log('Change received:', payload)
     )
     .subscribe()
   
   // On other tab, add bookmark
   // First tab should log the change
   ```

3. **Check Network**
   ```
   Browser → DevTools → Network → WS (WebSocket)
   Should see connections to Supabase
   If not: firewall might be blocking
   ```

4. **Test with Same Tab**
   - Add bookmark, check if filter/sort works
   - Delete bookmark, check if removed
   - If working in same tab, real-time issue is different device

### Multiple Subscribers/Connections

**Problem**: App creates duplicate real-time subscriptions

**Solution**:
```typescript
// In dashboard/page.tsx
useEffect(() => {
  // Previous subscription not cleaned up
  
  return () => {
    channel?.unsubscribe()  // Must unsubscribe on cleanup
  }
}, [channel])
```

---

## UI/Performance Issues

### "Loading..." Spinner Stays Forever

**Problem**: App stuck in loading state

**Solutions**:

1. **Check Network Requests**
   ```
   DevTools → Network
   Look for failed requests (red)
   Check API errors
   ```

2. **Check Database Permissions**
   ```sql
   SELECT * FROM bookmarks;
   -- If permission denied: RLS policy issue
   ```

3. **Restart App**
   ```bash
   npm run dev
   # Or clear browser cache
   ```

### Page Flickers / Layout Shifts

**Problem**: Layout changes during loading

**Solution**: Not a bug - normal behavior
- Unauthenticated → redirects to /
- Authenticated → loads dashboard
- Expected with auth checks

### Slow Performance / High Latency

**Causes**:
- Large number of bookmarks
- Network latency
- Browser extensions

**Solutions**:

1. **Use Database Index**
   - Already configured in DATABASE_SCHEMA.sql
   - Indexes on: user_id, created_at

2. **Limit Query Results**
   ```typescript
   // Consider pagination for 1000+ bookmarks
   const { data } = await supabase
     .from('bookmarks')
     .select('*')
     .limit(100)  // Load first 100
   ```

3. **Check Network Speed**
   - DevTools → Network → throttle to 3G
   - App should still feel responsive

---

## Deployment Issues

### Build Fails on Vercel: "Cannot find module"

**Problem**: Build succeeds locally but fails on Vercel

**Causes**:
- Case-sensitive file names (Mac != Linux)
- Missing dependency in package.json
- TypeScript error not caught locally

**Solutions**:

1. **Check File Names**
   ```
   File names must match exactly
   BookmarkForm.tsx (correct)
   bookmarkform.tsx (wrong)
   ```

2. **Build Locally**
   ```bash
   npm run build
   # Check for TypeScript errors before pushing
   ```

3. **Check node_modules**
   ```bash
   npm install
   npm run build
   ```

### Environment Variables Not Working on Vercel

**Problem**: App works locally but not on Vercel

**Solution**:
1. Vercel Dashboard → Settings → Environment Variables
2. Verify both variables added:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Check they're set for Production environment
4. Redeploy after adding variables:
   ```
   Vercel Dashboard → Deployments → Redeploy
   ```

### OAuth Fails on Vercel Deployment

**Problem**: Login works locally but not on production URL

**Solution**:
1. Get your Vercel deployment URL
2. Add to Google OAuth authorized URIs:
   ```
   https://[your-vercel-domain].vercel.app/auth/callback
   ```
3. Add same URL to Supabase Google provider
4. Redeploy on Vercel

### Database Not Accessible from Vercel

**Problem**: Vercel can't connect to Supabase

**Solutions**:

1. **Check Connection String**
   - Verify NEXT_PUBLIC_SUPABASE_URL is correct
   - Should be: `https://[project-id].supabase.co`

2. **Check Firewall**
   - Supabase should allow all (no IP restrictions needed for anon key)
   - Check Supabase → Settings → Database → Firewall

3. **Test Connection**
   ```
   Vercel Logs:
   - Check for connection timeout errors
   - Look for "Cannot connect to database"
   ```

---

## Browser-Specific Issues

### Safari: OAuth Doesn't Work

**Problem**: Google login fails on Safari

**Solution**:
- Check privacy settings: Settings → Privacy
- Allow 3rd-party cookies for supabase.com
- Allow popups for localhost:3000

### Firefox: Bookmarks Can't Delete

**Problem**: Delete fails on Firefox but works on Chrome

**Solution**:
```javascript
// Check browser console for errors
// Firefox might have CORS issues
// Verify Supabase CORS settings
```

### Edge: Real-Time Not Working

**Problem**: WebSocket connections fail on Edge

**Solution**:
- Check Edge privacy/security settings
- Try incognito mode
- Verify firewall not blocking WebSocket

---

## Getting More Help

### Before Asking for Help

1. **Check Error Message**
   - Read full error in console
   - Google the error code

2. **Check This Guide**
   - Search for your issue here
   - Follow all troubleshooting steps

3. **Check Documentation**
   - [Supabase Docs](https://supabase.io/docs)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Tailwind Docs](https://tailwindcss.com/docs)

4. **Gather Information**
   - Browser console error messages
   - API response in Network tab
   - Supabase logs
   - Code snippet showing issue

### Where to Get Help

- **Supabase**: [discord.supabase.com](https://discord.supabase.com)
- **Next.js**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Stack Overflow**: Tag `next.js`, `supabase`, `react`

### Create Minimal Reproduction

When reporting bugs:
1. Create minimal example
2. Share code snippet
3. Include error message
4. Share steps to reproduce

---

## Quick Checklist

When something doesn't work, verify:

- [ ] `.env.local` exists and has correct credentials
- [ ] `npm install` completed successfully
- [ ] Supabase bookmarks table created
- [ ] Google OAuth configured in Supabase
- [ ] RLS policies enabled
- [ ] Redirect URIs match (localhost:3000 and Vercel domain)
- [ ] Browser cookies/localStorage enabled
- [ ] No blocking extensions (privacy/ad blockers)
- [ ] Network requests not failing (DevTools → Network)
- [ ] No TypeScript errors: `npm run build`

---

**Last Updated**: February 2026
**Status**: Actively Maintained ✅

**Not finding your issue?** Check [README.md](./README.md) or open an issue on GitHub.
