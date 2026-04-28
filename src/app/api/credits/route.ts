import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

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

    // 调用数据库函数获取积分余额
    const { data, error } = await supabase
      .rpc('get_user_credits', { p_user_id: user.id })

    if (error) {
      console.error('获取积分失败:', error)
      return NextResponse.json({ error: '获取积分失败' }, { status: 500 })
    }

    // 如果用户不存在，创建用户记录并赋予初始积分
    if (!data || data.length === 0) {
      // 尝试授予初始积分
      const { data: grantResult, error: grantError } = await supabase
        .rpc('grant_initial_credits', { p_user_id: user.id })

      if (grantError) {
        console.error('授予初始积分失败:', grantError)
        return NextResponse.json({ credits: 0 })
      }

      return NextResponse.json({ credits: grantResult?.[0]?.new_balance || 20 })
    }

    return NextResponse.json({ credits: data[0]?.credits || 0 })
  } catch (error) {
    console.error('积分接口错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}