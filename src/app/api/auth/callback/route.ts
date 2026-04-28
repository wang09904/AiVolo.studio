import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

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

  // 检查用户是否已存在，不存在则创建并给予初始积分
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id, credits')
    .eq('id', user.id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    // PGRST116 表示没有找到记录，其他错误需要记录
    console.error('查询用户错误:', fetchError)
  }

  if (!existingUser) {
    // 新用户：创建记录并给予 20 积分初始奖励
    const { error: insertError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      credits: 20, // 新用户初始积分
    })

    if (insertError) {
      console.error('创建用户记录错误:', insertError)
      // 不阻止登录，只是积分可能没有正确初始化
    }
  }

  // 重定向到首页（登录成功）
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
}