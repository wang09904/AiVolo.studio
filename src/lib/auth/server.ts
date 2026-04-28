import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 创建带 Cookie 的服务端客户端（认证专用）
 * 与 supabase/server.ts 的区别：此版本专门处理认证流程
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component 中调用时忽略错误
          }
        },
      },
    }
  )
}