import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

async function signOutAndRedirect() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('登出错误:', error)
    // 即使有错误也重定向，让用户退出
  }

  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL))
}

/**
 * 登出
 * 清除 session 并重定向到首页
 */
export async function GET() {
  return signOutAndRedirect()
}

export async function POST() {
  return signOutAndRedirect()
}
