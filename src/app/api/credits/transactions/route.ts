import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

/**
 * 获取积分流水历史
 * GET /api/credits/transactions
 */
export async function GET() {
  try {
    const supabase = await createClient()

    // 获取当前会话用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('credits_transactions')
      .select('id, type, amount, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('获取积分流水失败:', error)
      return NextResponse.json({ error: '获取流水失败' }, { status: 500 })
    }

    return NextResponse.json({ transactions: data || [] })
  } catch (error) {
    console.error('积分流水接口错误:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
