'use client'

import { useState } from 'react'
import { supabase, type Bookmark } from '@/lib/supabaseClient'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  onBookmarkDeleted: (id: string) => void
}

export default function BookmarkList({
  bookmarks,
  onBookmarkDeleted,
}: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (bookmarkId: string) => {
    try {
      setDeletingId(bookmarkId)
      setError(null)

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)

      if (error) throw error

      onBookmarkDeleted(bookmarkId)
    } catch (err) {
      console.error('Error deleting bookmark:', err)
      setError('Failed to delete bookmark')
      setDeletingId(null)
    }
  }

  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔖</div>
        <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
        <p className="text-text-secondary">
          Add your first bookmark above to get started!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Bookmarks ({bookmarks.length})</h2>

      {error && (
        <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="card hover:border-accent/50 group transition-all duration-300 animate-fadeIn"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title - Clickable Link */}
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2 font-medium hover:text-accent transition-colors break-words"
                >
                  {bookmark.title}
                </a>

                {/* URL and Date */}
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors truncate"
                  >
                    {formatUrl(bookmark.url)}
                  </a>
                  <span className="ml-2 whitespace-nowrap">
                    {formatDate(bookmark.created_at)}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(bookmark.id)}
                disabled={deletingId === bookmark.id}
                className="btn btn-danger p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                title="Delete bookmark"
              >
                {deletingId === bookmark.id ? (
                  <span className="inline-block animate-spin-custom">⏳</span>
                ) : (
                  <span>🗑️</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
