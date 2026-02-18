'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function Header({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.replace('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const userEmail = user?.email || 'User'
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur border-b border-border">
      <div className="container mx-auto max-w-2xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">📑</span>
          <h1 className="text-xl font-bold">Smart Bookmark</h1>
        </div>

        {/* User Profile and Logout */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userEmail}</p>
              <p className="text-xs text-text-secondary">Connected</p>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-bold text-white">
              {userInitial}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
