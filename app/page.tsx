'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.replace('/dashboard')
      }
    }

    checkAuth()
  }, [router])

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-center px-4">
      <div className="w-full max-w-md">
        <div className="card text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="text-6xl mb-4">📑</div>
            <h1 className="text-3xl font-bold">Smart Bookmark</h1>
            <p className="text-text-secondary text-sm">
              Save and sync your bookmarks across all your devices
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger/10 border border-danger text-danger px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin-custom">⏳</span>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          {/* Features */}
          <div className="space-y-3 text-text-secondary text-sm pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Real-time sync across devices</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Secure with Google authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>Private and encrypted storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
