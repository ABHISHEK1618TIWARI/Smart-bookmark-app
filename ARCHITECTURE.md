# Architecture Overview

## Project Structure

```
smart-bookmark-app/
│
├── app/                       # Next.js 14 App Router
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Login page (public)
│   ├── globals.css            # Global styles
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts       # OAuth callback handler
│   └── dashboard/             # Protected route
│       ├── layout.tsx         # Auth wrapper
│       └── page.tsx           # Main app page
│
├── components/                # React components
│   ├── Header.tsx             # Top navigation & logout
│   ├── BookmarkForm.tsx       # Add bookmark form
│   └── BookmarkList.tsx       # Display bookmarks
│
├── lib/
│   └── supabaseClient.ts      # Supabase client init
│
├── public/                    # Static assets (auto-created by Next.js)
│
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── .eslintrc.json
│
├── Documentation
│   ├── README.md              # Main documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── QUICK_START.md         # 5-minute setup
│   ├── DATABASE_SCHEMA.sql    # SQL schema
│   ├── ARCHITECTURE.md        # This file
│   └── .env.local.example     # Environment template
│
└── Git Files
    └── .gitignore
```

## Technology Stack

### Frontend
- **Next.js 14**: App Router (not Pages Router)
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing

### Backend & Auth
- **Supabase**: 
  - PostgreSQL database
  - Auth with Google OAuth
  - Realtime subscriptions
  - Row Level Security (RLS)

### Deployment
- **Vercel**: Hosting & CI/CD
- **GitHub**: Version control & deployment trigger

## Data Flow Diagram

```
Client (Browser)
├── Login Page
│   └── Google OAuth → Google → Supabase Auth
├── Dashboard (Protected)
│   ├── Add Bookmark Form
│   │   └── POST /api/bookmarks (via supabase-js)
│   │       └── Supabase (Insert into bookmarks table)
│   │           └── Realtime broadcasts update
│   └── Bookmark List
│       ├── Initial fetch (SELECT from bookmarks table)
│       └── Realtime subscription (INSERT/DELETE/UPDATE events)
```

## Authentication Flow

```
1. User visits app → Login page (/page.tsx)
   ↓
2. Clicks "Sign in with Google"
   ↓
3. Redirected to Google OAuth consent screen
   ↓
4. User authorizes app
   ↓
5. Google redirects to /auth/callback with code
   ↓
6. Callback handler exchanges code for session (route.ts)
   ↓
7. Session stored in browser (Supabase SDK handles)
   ↓
8. Redirected to /dashboard
   ↓
9. Dashboard layout checks auth (layout.tsx)
   └── If authenticated: Show dashboard
   └── If not authenticated: Redirect to login
```

## Real-Time Sync Architecture

```
Tab 1 (Browser 1)          Supabase          Tab 2 (Browser 2)
    ↓                          ↓                    ↓
User adds bookmark
    │                                               │
    ├──→ INSERT request ──────→ PostgreSQL          │
    │                              ↓                │
    │                         RLS Check             │
    │                         (user owns)           │
    │                              ↓                │
    │                         Insert in DB          │
    │                              ↓                │
    │                    Broadcast via Realtime ←──┤
    │                              │                │
    ├─ Realtime subscription ←────┘                │
    │ receives INSERT event                         │
    │                                        Realtime subscription
    ├─ State updates               ←────────  receives INSERT event
    │ (setBookmarks)                               │
    │                                        ├─ State updates
    │                                        │ (setBookmarks)
    │                                        │
Tab 1 shows new bookmark         Tab 2 shows new bookmark
(instant)                         (instant)
```

## Authentication & Security

### Row Level Security (RLS) Policies

```sql
-- All queries must pass through RLS checks

SELECT bookmarks
├─ WHERE user_id = auth.uid()  ✅ Users see only own bookmarks

INSERT bookmarks
├─ WHERE user_id = auth.uid()  ✅ Users can only own their bookmarks

DELETE bookmarks
├─ WHERE user_id = auth.uid()  ✅ Users can only delete own bookmarks

UPDATE bookmarks
├─ WHERE user_id = auth.uid()  ✅ Users can only update own bookmarks
```

### Session Management

```
Browser Storage (Supabase SDK managed)
├─ Session token
├─ Refresh token
└─ User metadata

- Tokens secured with:
  └─ HTTPOnly cookies (when applicable)
  └─ HTTPS encryption in transit
  └─ Secure storage in Supabase
```

## Component Architecture

### Login Page (`/app/page.tsx`)
- **Type**: Page component
- **Auth**: Public access
- **Features**:
  - Google OAuth button
  - Error handling
  - Auto-redirect if authenticated
  - Loading states

### Dashboard Layout (`/app/dashboard/layout.tsx`)
- **Type**: Layout wrapper
- **Auth**: Protected (checks session)
- **Features**:
  - Auth verification
  - Auto-redirect to login if unauthorized
  - Auth state listener

### Dashboard Page (`/app/dashboard/page.tsx`)
- **Type**: Page component
- **Auth**: Protected
- **Features**:
  - Fetches user's bookmarks
  - Sets up Realtime subscription
  - Manages app state
  - Renders Header + Form + List

### Header Component (`/components/Header.tsx`)
- **Type**: Client component
- **Features**:
  - Display user email
  - Logout functionality
  - Sticky positioning
  - Responsive design

### BookmarkForm Component (`/components/BookmarkForm.tsx`)
- **Type**: Client component
- **Features**:
  - Form validation (URL, title)
  - Error handling
  - Submit to Supabase
  - Success feedback
  - Loading states

### BookmarkList Component (`/components/BookmarkList.tsx`)
- **Type**: Client component
- **Features**:
  - Display bookmarks
  - Delete functionality
  - Empty state
  - Relative timestamps
  - Hover effects

## Database Schema

### bookmarks table

```sql
Table: public.bookmarks
├── Columns
│   ├── id (UUID) - Primary Key
│   ├── user_id (UUID) - Foreign Key to auth.users
│   ├── title (TEXT) - Bookmark title, not empty
│   ├── url (TEXT) - Bookmark URL, not empty
│   └── created_at (TIMESTAMP) - Auto-set to now()
│
├── Indexes
│   ├── idx_bookmarks_user_id
│   ├── idx_bookmarks_created_at
│   └── idx_bookmarks_user_created (composite)
│
└── RLS Enabled
    ├── Policy: SELECT (own bookmarks only)
    ├── Policy: INSERT (own bookmarks only)
    ├── Policy: DELETE (own bookmarks only)
    └── Policy: UPDATE (own bookmarks only)
```

## Environment Variables

### Public Variables (visible in browser)
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Public API key
```

These are safe to expose because:
- Only allow public operations
- RLS policies protect data
- Cannot authenticate users
- Cannot access private data

### Private Variables (server-only)
None currently needed. Future scalability might add:
- Service Role Key (for admin operations)
- Webhook secrets

## Performance Optimizations

### Frontend
- **Code Splitting**: Next.js automatic
- **CSS Minification**: Tailwind production mode
- **Image Optimization**: Next.js Image component (if used)
- **Lazy Loading**: React.lazy() for components
- **Caching**: ISR (Incremental Static Regeneration) patterns

### Database
- **Indexes**: On frequently queried columns
- **Composite Index**: (user_id, created_at) for common query
- **RLS Optimization**: Policies are efficient

### Network
- **Realtime**: Efficient WebSocket connections
- **CDN**: Vercel edge network
- **Compression**: Built into Next.js/Vercel

## Scalability Considerations

### Current Limits
- Single database (Supabase free tier: 500MB)
- Standard RLS performance
- Realtime subscriptions (standard)

### Future Scaling
- **DB Growth**: Switch to Supabase paid plan
- **Realtime**: Premium Realtime for higher concurrency
- **API**: Add Edge Functions for custom logic
- **Caching**: Add Redis for frequently accessed data
- **Load**: Vercel Pro for guaranteed compute

## Error Handling

### Client-Side
- Network errors in try-catch blocks
- Form validation messages
- Loading states during async operations
- User-friendly error messages

### Supabase-Side
- RLS prevents unauthorized access
- Constraint checks enforce data integrity
- Foreign keys maintain referential integrity

### Auth
- Invalid tokens rejected by Supabase
- Expired sessions auto-refresh
- Failed OAuth returns to login

## Testing Strategy (Future)

Recommended testing setup:
- **Unit**: Jest + React Testing Library
- **Integration**: Supertest for API
- **E2E**: Playwright or Cypress
- **Visual**: Chromatic or Percy

---

**Architecture Status**: Production Ready ✅
Last Updated: February 2026
