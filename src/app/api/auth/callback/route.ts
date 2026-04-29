import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'
import { ensureUserProfile } from '@/lib/auth/profile'

/**
 * OAuth 回调处理
 * 1. 验证 OAuth 回调 code
 * 2. 创建/更新 users 表记录
 * 3. 新用户给予 20 积分初始奖励
 * 4. 重定向到首页
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'

  // 处理错误情况
  if (error) {
    console.error('OAuth 回调错误:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, process.env.NEXT_PUBLIC_SITE_URL)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=missing_code', process.env.NEXT_PUBLIC_SITE_URL)
    )
  }

  const supabase = await createClient()

  // 兑换 OAuth code 获取 session
  const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)

  if (authError || !authData.user) {
    console.error('Session 交换错误:', authError)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(authError?.message || 'auth_failed')}`, process.env.NEXT_PUBLIC_SITE_URL)
    )
  }

  const user = authData.user

  const { error: profileError } = await ensureUserProfile(supabase, user)

  if (profileError) {
    console.error('初始化用户资料错误:', profileError)
  }

  return NextResponse.redirect(new URL(safeNext, process.env.NEXT_PUBLIC_SITE_URL))
}
