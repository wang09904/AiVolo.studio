import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

/**
 * Google OAuth 登录
 * 引导用户到 Google 授权页面
 */
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      queryParams: {
        prompt: 'select_account', // 每次都显示账号选择，避免缓存账号
      },
    },
  })

  if (error) {
    console.error('Google OAuth 登录错误:', error)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, process.env.NEXT_PUBLIC_SITE_URL)
    )
  }

  return NextResponse.redirect(data.url)
}