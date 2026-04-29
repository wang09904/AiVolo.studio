import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'
import { ensureUserProfile } from '@/lib/auth/profile'

export const dynamic = 'force-dynamic'

/**
 * 获取当前用户积分余额
 * GET /api/credits
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // 获取当前会话用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { profile, error: profileError } = await ensureUserProfile(supabase, user)

    if (profileError || !profile) {
      console.error('获取或创建用户资料失败:', profileError)
      return NextResponse.json(
        {
          error: 'Failed to initialize user credits',
          details: profileError instanceof Error ? profileError.message : profileError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ credits: profile.credits_balance ?? 0 })
  } catch (error) {
    console.error('积分接口错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
