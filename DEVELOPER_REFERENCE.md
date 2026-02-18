# Developer Reference

Quick reference guide for Smart Bookmark App development.

## File Locations

### Pages (App Router)
```
/app/page.tsx                    Login page (public)
/app/dashboard/page.tsx         Dashboard (protected)
/app/auth/callback/route.ts     OAuth callback handler
```

### Components
```
/components/Header.tsx          Navigation + user profile
/components/BookmarkForm.tsx    Add bookmark form
/components/BookmarkList.tsx    Display bookmarks
```

### Configuration
```
/lib/supabaseClient.ts          Supabase client init
/app/globals.css                Global styles & utilities
/app/layout.tsx                 Root layout
/tailwind.config.ts             Tailwind config
/next.config.js                 Next.js config
```

---

## Supabase Client API Reference

### Initialize Client
```typescript
import { supabase } from '@/lib/supabaseClient'
```

### Authentication

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
const { data: { session } } = await supabase.auth.getSession()
```

#### Sign In with Google
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

#### Sign Out
```typescript
await supabase.auth.signOut()
```

#### Listen to Auth Changes
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // event: 'INITIAL_SESSION', 'SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'USER_UPDATED'
  console.log(session?.user?.email)
})
```

---

### Database Queries

#### Select Bookmarks
```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })

// With pagination
.limit(50)
.offset(0)
```

#### Insert Bookmark
```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .insert([{
    user_id: userId,
    title: 'My Bookmark',
    url: 'https://example.com',
  }])
  .select()  // Returns inserted record
```

#### Delete Bookmark
```typescript
const { error } = await supabase
  .from('bookmarks')
  .delete()
  .eq('id', bookmarkId)
```

#### Update Bookmark
```typescript
const { data, error } = await supabase
  .from('bookmarks')
  .update({
    title: 'Updated Title',
    url: 'https://new-url.com',
  })
  .eq('id', bookmarkId)
  .select()
```

---

### Real-Time Subscriptions

#### Subscribe to Changes
```typescript
const channel = supabase
  .channel(`bookmarks-${userId}`)
  .on(
    'postgres_changes',
    {
      event: '*',           // 'INSERT' | 'UPDATE' | 'DELETE' | '*'
      schema: 'public',
      table: 'bookmarks',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Event:', payload.eventType)
      console.log('New:', payload.new)
      console.log('Old:', payload.old)
    }
  )
  .subscribe()
```

#### Unsubscribe from Changes
```typescript
channel.unsubscribe()
```

---

## React Hooks Patterns

### Use Client (Required for Interactive Components)
```typescript
'use client'  // Top of file

export default function MyComponent() {
  // Client-side only code here
}
```

### Use Server Component (Default)
```typescript
// No 'use client' directive
export default function MyComponent() {
  // Server-side rendering
  // Cannot use hooks, event handlers, etc.
}
```

### Use State
```typescript
import { useState } from 'react'

const [value, setValue] = useState('')
const [loading, setLoading] = useState(false)
```

### Use Effect
```typescript
import { useEffect } from 'react'

useEffect(() => {
  // Setup
  const fetchData = async () => {
    // ...
  }
  
  return () => {
    // Cleanup
  }
}, [dependencies])
```

### Use Callback
```typescript
import { useCallback } from 'react'

const handleClick = useCallback((bookmarkId: string) => {
  // Handle click
}, [dependencies])
```

### Use Router
```typescript
import { useRouter } from 'next/navigation'  // Important: from 'next/navigation'

const router = useRouter()

// Navigate
router.push('/dashboard')
router.replace('/')  // Without back button
```

---

## Tailwind CSS Classes

### Common Utilities

#### Colors
```
bg-primary         Background primary (#0f0f0f)
bg-secondary       Background secondary (#1a1a1a)
bg-accent          Accent color (#ff6b35)
bg-danger          Error/danger (#ff4757)
text-text-primary  White text
text-text-secondary Gray text
border-border      Border color (#333333)
```

#### Layout
```
container mx-auto        Centered container
max-w-2xl                Max width 600px
px-4                     Horizontal padding
py-8                     Vertical padding
flex items-center        Flex with alignment
justify-between          Space between
gap-4                    Gap between items
```

#### Cards & Buttons
```
card                     Pre-styled card (our custom class)
btn btn-primary          Primary button
btn btn-secondary        Secondary button
btn btn-danger           Danger button
hover:opacity-80         Hover effect
disabled:opacity-50      Disabled style
```

#### States
```
animate-fadeIn           Fade in animation
animate-spin-custom      Loading spinner
transition-colors        Smooth color transition
duration-300             Animation duration
```

---

## Database Schema

### Bookmarks Table
```sql
id              UUID PRIMARY KEY
user_id         UUID FOREIGN KEY (auth.users.id)
title           TEXT NOT NULL
url             TEXT NOT NULL
created_at      TIMESTAMP DEFAULT now()
```

### RLS Policies
```
SELECT: auth.uid() = user_id
INSERT: auth.uid() = user_id  
DELETE: auth.uid() = user_id
UPDATE: auth.uid() = user_id
```

### Indexes
```
idx_bookmarks_user_id                    On user_id
idx_bookmarks_created_at                 On created_at DESC
idx_bookmarks_user_created (user_id, created_at DESC)
```

---

## Common Tasks

### Add New Feature

1. **Create Component** (if UI needed)
   ```
   /components/NewFeature.tsx
   'use client' at top
   Use Tailwind for styling
   ```

2. **Add Page** (if new route)
   ```
   /app/new-route/page.tsx
   Add protected layout if needed
   ```

3. **Database Query** (if data needed)
   ```
   Use supabase.from().select/insert/delete/update()
   Don't forget error handling
   ```

4. **Add Styles**
   ```
   Use existing Tailwind classes in /app/globals.css
   Or add new ones to tailwind.config.ts
   ```

5. **Test Locally**
   ```
   npm run dev
   Test all user flows
   Check browser console
   ```

6. **Deploy**
   ```
   git add .
   git commit -m "Add new feature"
   git push
   Vercel auto-deploys
   ```

### Add Database Column

1. **Create Migration** (in DATABASE_SCHEMA.sql style)
   ```sql
   ALTER TABLE bookmarks ADD COLUMN new_column TEXT;
   ```

2. **Update Type** (if using TypeScript)
   ```typescript
   // In lib/supabaseClient.ts
   export type Bookmark = {
     ...
     new_column?: string
   }
   ```

3. **Update Components** (if UI needed)
   ```typescript
   // In affected components
   ```

4. **Update RLS** (if needed)
   ```sql
   -- Might need to adjust policies
   ```

### Debug Issues

1. **Check Browser Console** (F12)
   ```
   Look for red errors
   Network tab for API calls
   ```

2. **Check Supabase Logs**
   ```
   Supabase Dashboard → Logs
   Look for errors
   Check auth logs
   ```

3. **Test Query Directly**
   ```
   Supabase SQL Editor
   Run query manually
   Test RLS policies
   ```

4. **Add Console Logs**
   ```typescript
   console.log('Debug:', value)
   // Remove before commit
   ```

---

## Performance Tips

### Database
- ✅ Use indexes for frequent queries
- ✅ Limit results with `.limit()`
- ✅ Use specific column selection
- ❌ Avoid SELECT *
- ❌ Don't fetch unnecessary data

### Frontend
- ✅ Use `useCallback` for stable functions
- ✅ Memoize expensive computations
- ✅ Lazy load components if large
- ❌ Don't create new arrays/objects in render
- ❌ Don't inline styles

### Network
- ✅ Use Tailwind CSS (optimized)
- ✅ Minimize re-renders
- ✅ Cache static content
- ❌ Don't make unnecessary requests
- ❌ Don't poll real-time data

---

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Use auth.uid() in policies
- ✅ Never expose service key
- ✅ Validate input on client & server
- ✅ Use HTTPS (automatic on Vercel)
- ✅ Keep dependencies updated
- ✅ Review error messages (don't leak info)

---

## Testing Commands

```bash
# Development
npm run dev                 # Start dev server

# Build & Test
npm run build              # Production build
npm start                  # Run production build

# Linting
npm run lint               # Check code quality

# Environment
cat .env.local             # View env vars
npm install                # Install dependencies
npm update                 # Update packages
npm audit                  # Security audit
```

---

## Useful Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Tools
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Git Cheat Sheet](https://github.github.com/training-kit/github-git-cheat-sheet.pdf)
- [Markdown Guide](https://www.markdownguide.org)

### Communities
- [Next.js Discord](https://discord.gg/bUG7V3r)
- [Supabase Discord](https://discord.supabase.com)
- [React Discord](https://discord.gg/react)

---

## Key Concepts

### Controlled Components
```typescript
// Good - controlled by React
const [value, setValue] = useState('')
return <input value={value} onChange={e => setValue(e.target.value)} />

// Avoid - uncontrolled
return <input defaultValue="test" />
```

### Conditional Rendering
```typescript
// Good - clear and readable
{isLoading && <Spinner />}
{!isLoading && data && <Content data={data} />}
{!isLoading && !data && <Empty />}

// Avoid - confusing
{isLoading ? (data ? <Content /> : <Empty />) : <Spinner />}
```

### Error Boundaries
```typescript
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  // Use data
} catch (err) {
  setError('User-friendly message')
  console.error(err)  // Log full error for debugging
}
```

---

## Code Style

### Naming
```
Components:      PascalCase (Header, BookmarkForm)
Functions:       camelCase (handleClick, fetchBookmarks)
Constants:       camelCase (maxLength, defaultValue)
Types:           PascalCase (Bookmark, User)
Files:           kebab-case (header.tsx, bookmark-form.tsx)
Directories:     lowercase (components, lib, app)
```

### Formatting
```
- 2 spaces for indentation
- No semicolons (optional in TypeScript)
- Single quotes for strings
- Trailing commas in multiline objects
```

### Comments
```typescript
// Good - explains WHY
// RLS will prevent unauthorized access, this is an extra check
if (!user) return null

// Avoid - explains WHAT (code already clear)
// Set error message
setError('Error occurred')
```

---

**Last Updated**: February 2026
**Status**: Ready to Use ✅

For questions, check [README.md](./README.md) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
