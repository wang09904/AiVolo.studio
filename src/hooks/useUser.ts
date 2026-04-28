'use client'

import { createClient } from '@/lib/auth/client'

export interface User {
  id: string
  email: string | null
  name: string | null
  avatar_url: string | null
  credits: number
}

/**
 * 获取当前用户信息
 * 包含 users 表的积分余额
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  // 获取用户的积分信息
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, name, avatar_url, credits')
    .eq('id', user.id)
    .single()

  if (userError) {
    // 如果 users 表还没有记录，返回基础信息
    return {
      id: user.id,
      email: user.email ?? null,
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      credits: 0,
    }
  }

  return userData as User
}