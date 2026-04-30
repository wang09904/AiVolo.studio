import { NextRequest, NextResponse } from 'next/server'
import { getSignedUploadUrl, generateFilePath } from '@/lib/storage/r2'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const body = await request.json()
    const { filename, contentType, type = 'image' } = body

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Missing required parameters: filename, contentType' },
        { status: 400 }
      )
    }

    if (type !== 'image' && type !== 'video') {
      return NextResponse.json(
        { error: 'Unsupported file type.' },
        { status: 400 }
      )
    }

    const key = generateFilePath(user.id, filename, type)

    const signedUrl = await getSignedUploadUrl(key, contentType, 3600)

    return NextResponse.json({
      uploadUrl: signedUrl,
      key,
      expiresIn: 3600,
    })
  } catch (error) {
    console.error('Upload signed URL route failed:', error)
    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    )
  }
}
