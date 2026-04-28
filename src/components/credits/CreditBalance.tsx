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

  useEffect(() => {
    const fetchCredits = async () => {
      const supabase = createClient()

      // 检查登录状态
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      setIsLoggedIn(true)

      // 获取积分
      try {
        const response = await fetch('/api/credits')
        const data = await response.json()
        setCredits(data.credits ?? 0)
      } catch (error) {
        console.error('获取积分失败:', error)
        setCredits(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCredits()
  }, [])

  if (!isLoggedIn) {
    return (
      <a
        href="/api/auth/google"
        className={`px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-violet-500/25 ${className}`}
      >
        登录
      </a>
    )
  }

  if (isLoading) {
    return (
      <span className={`px-4 py-2 bg-slate-800 text-slate-400 text-sm rounded-lg ${className}`}>
        加载中...
      </span>
    )
  }

  return (
    <span className={`px-4 py-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium rounded-lg ${className}`}>
      {credits ?? 0} 积分
    </span>
  )
}