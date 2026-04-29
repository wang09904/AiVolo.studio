'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CreditBalanceProps {
  className?: string
}

/**
 * 显示用户积分余额的组件
 * 登录后显示，未登录显示"登录"
 */
export default function CreditBalance({ className = '' }: CreditBalanceProps) {
  const [credits, setCredits] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    const fetchCredits = async () => {
      // 检查登录状态
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

      // 获取积分
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
        className={`px-4 py-2 bg-[oklch(72%_0.18_270)] hover:bg-[oklch(68%_0.18_270)] text-[oklch(16%_0.03_270)] text-sm font-medium rounded-md transition-colors ${className}`}
      >
        Sign in
      </a>
    )
  }

  if (isLoading) {
    return (
      <span className={`px-4 py-2 bg-[oklch(20%_0.018_270)] text-[oklch(66%_0.016_270)] text-sm rounded-md ${className}`}>
        Loading...
      </span>
    )
  }

  if (hasError) {
    return (
      <a
        href="/account"
        className={`px-4 py-2 bg-[oklch(24%_0.03_25)] border border-[oklch(42%_0.08_25)] text-[oklch(82%_0.08_25)] text-sm font-medium rounded-md ${className}`}
      >
        Credits unavailable
      </a>
    )
  }

  return (
    <span className={`px-4 py-2 bg-[oklch(20%_0.03_270)] border border-[oklch(38%_0.05_270)] text-[oklch(82%_0.08_270)] text-sm font-medium rounded-md ${className}`}>
      {credits ?? 0} credits
    </span>
  )
}
