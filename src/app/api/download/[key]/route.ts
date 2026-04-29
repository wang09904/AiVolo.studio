import { NextRequest, NextResponse } from 'next/server'
import { getSignedDownloadUrl } from '@/lib/storage/r2'
import { createClient } from '@/lib/supabase/server'

/**
 * 获取下载签名链接
 * GET /api/download/[key]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const { key } = await params

    if (!key) {
      return NextResponse.json(
        { error: '缺少文件路径参数' },
        { status: 400 }
      )
    }

    // 解码 URL 编码的文件路径
    const decodedKey = decodeURIComponent(key)

    if (!decodedKey.includes(`/${user.id}/`)) {
      return NextResponse.json(
        { error: '无权下载该文件' },
        { status: 403 }
      )
    }

    // 生成下载签名链接（24 小时有效期）
    const signedUrl = await getSignedDownloadUrl(decodedKey, 86400)

    return NextResponse.json({
      downloadUrl: signedUrl,
      key: decodedKey,
      expiresIn: 86400,
    })
  } catch (error) {
    console.error('获取下载签名链接失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
