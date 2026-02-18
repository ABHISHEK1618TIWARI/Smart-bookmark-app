'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase, type Bookmark } from '@/lib/supabaseClient'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import Header from '@/components/Header'

export default function DashboardPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const initRef = useRef(false)

  // Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initialize auth and realtime
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const initializeApp = async () => {
      try {
        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        if (!currentUser) {
          router.replace('/')
          return
        }

        setUser(currentUser)
        await fetchBookmarks(currentUser.id)

        // Set up realtime subscription
        const bookmarkChannel = supabase
          .channel(`bookmarks-${currentUser.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bookmarks',
              filter: `user_id=eq.${currentUser.id}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setBookmarks((prev) => [payload.new as Bookmark, ...prev])
              } else if (payload.eventType === 'DELETE') {
                setBookmarks((prev) =>
                  prev.filter((b) => b.id !== payload.old.id)
                )
              } else if (payload.eventType === 'UPDATE') {
                setBookmarks((prev) =>
                  prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                )
              }
            }
          )
          .subscribe()

        channelRef.current = bookmarkChannel
      } catch (error) {
        console.error('Error initializing app:', error)
      }
    }

    initializeApp()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [])

  const handleBookmarkAdded = (newBookmark: Bookmark) => {
    // Optimistically add the bookmark to the UI immediately
    setBookmarks((prev) => [newBookmark, ...prev])
  }

  const handleBookmarkDeleted = (bookmarkId: string) => {
    // Optimistically remove the bookmark from the UI immediately
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Header user={user} />
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin-custom text-4xl mb-4">⏳</div>
              <p className="text-text-secondary">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header user={user} />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        {/* Add Bookmark Section */}
        <div className="mb-8">
          <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        </div>

        {/* Bookmarks List Section */}
        <BookmarkList
          bookmarks={bookmarks}
          onBookmarkDeleted={handleBookmarkDeleted}
        />
      </main>
    </div>
  )
}
