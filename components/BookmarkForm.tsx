'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface BookmarkFormProps {
  onBookmarkAdded: (bookmark: any) => void
}

export default function BookmarkForm({ onBookmarkAdded }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validation
    if (!title.trim()) {
      setError('Please enter a bookmark title')
      return
    }

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (must start with http:// or https://)')
      return
    }

    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in to add bookmarks')
        return
      }

      // Add bookmark to database
      const { data, error } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            url: url.trim(),
          },
        ])
        .select()

      if (error) throw error

      // Clear form
      setUrl('')
      setTitle('')
      setSuccess(true)

      // Reset success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000)

      if (data) {
        onBookmarkAdded(data[0])
      }
    } catch (err) {
      console.error('Error adding bookmark:', err)
      setError('Failed to add bookmark. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold">Add New Bookmark</h2>

      {/* Error Message */}
      {error && (
        <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm animate-fadeIn">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg text-sm animate-fadeIn">
          ✓ Bookmark added successfully!
        </div>
      )}

      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-2">
          URL
        </label>
        <input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field"
          disabled={loading}
        />
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Give it a name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          disabled={loading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin-custom">⏳</span>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <span>＋</span>
            <span>Add Bookmark</span>
          </>
        )}
      </button>
    </form>
  )
}
