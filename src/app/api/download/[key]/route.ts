import { NextRequest, NextResponse } from 'next/server'
import { getSignedDownloadUrl } from '@/lib/storage/r2'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const { key } = await params

    if (!key) {
      return NextResponse.json(
        { error: 'Missing file path parameter.' },
        { status: 400 }
      )
    }

    const decodedKey = decodeURIComponent(key)

    if (!decodedKey.includes(`/${user.id}/`)) {
      return NextResponse.json(
        { error: 'You do not have access to this file.' },
        { status: 403 }
      )
    }

    const signedUrl = await getSignedDownloadUrl(decodedKey, 86400)

    return NextResponse.json({
      downloadUrl: signedUrl,
      key: decodedKey,
      expiresIn: 86400,
    })
  } catch (error) {
    console.error('Download signed URL route failed:', error)
    return NextResponse.json(
      { error: 'Server error.' },
      { status: 500 }
    )
  }
}
