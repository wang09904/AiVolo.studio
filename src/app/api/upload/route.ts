import { NextRequest, NextResponse } from 'next/server'
import { getSignedUploadUrl, generateFilePath } from '@/lib/storage/r2'
import { createClient } from '@/lib/supabase/server'

/**
 * 获取上传签名链接
 * POST /api/upload
 * Body: { filename: string, contentType: string, type: 'image' | 'video' }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json()
    const { filename, contentType, type = 'image' } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: '缺少必要参数: filename, contentType' },
        { status: 400 }
      )
    }

    if (type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { error: '文件类型不支持' },
        { status: 400 }
      )
    }

    // 生成文件路径
    const key = generateFilePath(user.id, filename, type)

    // 生成上传签名链接（1 小时有效期）
    const signedUrl = await getSignedUploadUrl(key, contentType, 3600)

    return NextResponse.json({
      uploadUrl: signedUrl,
      key,
      expiresIn: 3600,
    })
  } catch (error) {
    console.error('获取上传签名链接失败:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
