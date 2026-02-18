# Smart Bookmark App - Specification

## 1. Project Overview

- **Project Name**: Smart Bookmark App
- **Project Type**: Single-page Web Application
- **Core Functionality**: A bookmark manager where users can sign in with Google, add private bookmarks that sync in real-time across devices/tabs
- **Target Users**: Anyone who wants to save and organize their bookmarks privately

## 2. UI/UX Specification

### Layout Structure

- **Header**: Fixed top bar with app logo/title and user profile/logout button
- **Main Content**: Centered container for bookmark input and list
- **Responsive**: Single column layout that works on all devices

### Visual Design

**Color Palette**:
- Primary Background: `#0f0f0f` (deep black)
- Secondary Background: `#1a1a1a` (card background)
- Accent Color: `#ff6b35` (vibrant orange)
- Secondary Accent: `#00d4aa` (teal for success states)
- Text Primary: `#ffffff`
- Text Secondary: `#888888`
- Border Color: `#333333`
- Error/Delete: `#ff4757`

**Typography**:
- Font Family: `'Outfit', sans-serif` (from Google Fonts)
- Heading (App Title): 28px, weight 700
- Section Headers: 18px, weight 600
- Body Text: 14px, weight 400
- Small Text: 12px, weight 400

**Spacing**:
- Container max-width: 600px
- Card padding: 20px
- Element gap: 16px
- Border radius: 12px

**Visual Effects**:
- Subtle box-shadow on cards: `0 4px 20px rgba(0,0,0,0.3)`
- Smooth transitions: 0.3s ease
- Hover effects on buttons and list items
- Fade-in animation for new bookmarks

### Components

**1. Login Screen**
- Centered card with app title
- "Sign in with Google" button
- Dark theme with orange accent

**2. Header (Authenticated)**
- App title on left
- User avatar and name on right
- Logout button

**3. Add Bookmark Form**
- Input field for URL (placeholder: "Paste URL here...")
- Input field for title (placeholder: "Give it a name...")
- "Add Bookmark" button with plus icon

**4. Bookmark List**
- Scrollable list of bookmark cards
- Each card shows:
  - Favicon (if available)
  - Title (clickable, opens in new tab)
  - URL (truncated)
  - Delete button (trash icon)
- Empty state message when no bookmarks

**5. Loading States**
- Skeleton loader while fetching bookmarks
- Spinner on add/delete actions

## 3. Functionality Specification

### Core Features

**1. Google OAuth Authentication**
- Sign in with Google popup
- Persist session in localStorage
- Auto-login on page refresh
- Logout functionality

**2. Add Bookmark**
- Validate URL format (must start with http:// or https://)
- Validate title is not empty
- Generate unique ID for each bookmark
- Save to Firebase Realtime Database
- Clear form after successful add
- Show success feedback

**3. View Bookmarks**
- Fetch bookmarks ordered by creation time (newest first)
- Display loading state while fetching
- Show empty state when no bookmarks
- Real-time sync: updates automatically when other tabs add/delete

**4. Delete Bookmark**
- Delete button on each bookmark
- Confirmation before delete (optional, can be instant)
- Remove from Firebase
- Real-time sync across tabs

**5. Real-time Sync**
- Use Firebase onValue listener
- Any change in database reflects immediately
- Works across multiple tabs/devices

### Data Structure (Firebase)

```
json
{
  "bookmarks": {
    "user_google_id": {
      "bookmark_id": {
        "url": "https://example.com",
        "title": "Example Site",
        "createdAt": 1234567890
      }
    }
  }
}
```

### Edge Cases

- Invalid URL format: Show error message
- Empty title: Show error message
- Network error: Show error and retry option
- User not logged in: Redirect to login
- Duplicate URL: Allow (user might want multiple entries)

## 4. Acceptance Criteria

1. ✅ User can sign in with Google account
2. ✅ User can add a bookmark with URL and title
3. ✅ Bookmarks are saved and persist after refresh
4. ✅ User can only see their own bookmarks
5. ✅ Opening two tabs and adding bookmark in one shows in other without refresh
6. ✅ User can delete their own bookmarks
7. ✅ Deleted bookmarks disappear from all synced tabs
8. ✅ User can log out and log back in
9. ✅ UI matches the dark theme with orange accents

## 5. Technical Implementation

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend/BaaS**: Firebase (Authentication + Realtime Database)
- **Deployment**: Static file hosting (Firebase Hosting, Netlify, or GitHub Pages)

## 6. Setup Required

User needs to:
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Google sign-in in Authentication
3. Create a Web app and copy the config
4. Update the config in the code
