'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SignOutButtonProps {
  className?: string
}

export default function SignOutButton({ className = '' }: SignOutButtonProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)
    const supabase = createClient()

    await supabase.auth.signOut()
    await fetch('/api/auth/logout', {
      method: 'POST',
      cache: 'no-store',
    }).catch(() => null)

    router.replace('/')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={className}
    >
      {isSigningOut ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
