'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CreditBalanceProps {
  className?: string
}

export default function CreditBalance({ className = '' }: CreditBalanceProps) {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    const fetchCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (isMounted) {
          setCredits(null)
          setIsLoggedIn(false)
          setIsLoading(false)
          setHasError(false)
        }
        return
      }

      if (isMounted) {
        setIsLoggedIn(true)
        setIsLoading(true)
        setHasError(false)
      }

      try {
        const response = await fetch('/api/credits', {
          cache: 'no-store',
          credentials: 'include',
        })
        if (response.status === 401) {
          if (isMounted) {
            setCredits(null)
            setIsLoggedIn(false)
            setHasError(false)
          }
          return
        }
        const data = await response.json()
        if (!response.ok) {
          if (isMounted) {
            setCredits(null)
            setHasError(true)
          }
          console.warn('Credits unavailable:', data.details || data.error || response.status)
          return
        }
        if (isMounted) setCredits(data.credits)
      } catch (error) {
        console.warn('Credits request failed:', error instanceof Error ? error.message : error)
        if (isMounted) {
          setCredits(null)
          setHasError(true)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchCredits()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCredits()
    })

    window.addEventListener('aivolo:credits-updated', fetchCredits)

    return () => {
      isMounted = false
      window.removeEventListener('aivolo:credits-updated', fetchCredits)
      subscription.unsubscribe()
    }
  }, [])

  if (!isLoggedIn) {
    return (
      <a
        href="/api/auth/google"
        className={`rounded-xl bg-brand-cta px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 hover:bg-brand-cta/90 ${className}`}
      >
        Sign in
      </a>
    )
  }

  if (isLoading) {
    return (
      <span className={`rounded-xl bg-brand-secondary px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-slate-500 ${className}`}>
        Loading...
      </span>
    )
  }

  if (hasError) {
    return (
      <a
        href="/account"
        className={`rounded-xl border-2 border-red-500/20 bg-red-500/10 px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-red-400 ${className}`}
      >
        Unavailable
      </a>
    )
  }

  return (
    <span className={`rounded-xl border-2 border-brand-cta/20 bg-brand-primary px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white shadow-md ${className}`}>
      {credits ?? 0} <span className="text-brand-cta">Credits</span>
    </span>
  )
}
