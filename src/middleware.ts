import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 需要登录才能访问的路径
 */
const protectedPaths = ['/create', '/account']

/**
 * 认证中间件
 * - 检查受保护路径是否已登录
 * - 未登录则重定向到首页（首页有登录按钮）
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // 获取 supabase session cookie
  const supabaseSessionCookie = request.cookies.get('sb-access-token')?.value

  // 如果没有 session，重定向到首页
  if (!supabaseSessionCookie) {
    const redirectUrl = new URL('/', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 公共静态资源
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}