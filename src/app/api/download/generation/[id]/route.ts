import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSignedDownloadUrl } from '@/lib/storage/r2'

type RouteContext = {
  params: Promise<{ id: string }>
}

type GenerationDownloadRow = {
  image_url: string | null
  storage_key: string | null
  status: string | null
}

async function findGenerationForDownload(
  supabase: Awaited<ReturnType<typeof createClient>>,
  generationId: string,
  userId: string
): Promise<{ row: GenerationDownloadRow | null; error: unknown | null }> {
  const query = supabase
    .from('generations')
    .select('image_url, storage_key, status')
    .eq('id', generationId)
    .eq('user_id', userId)
    .maybeSingle()

  const { data, error } = await query

  if (!error) {
    return { row: data as GenerationDownloadRow | null, error: null }
  }

  const message = 'message' in error && typeof error.message === 'string' ? error.message : ''

  if (!message.includes('storage_key')) {
    return { row: null, error }
  }

  const fallback = await supabase
    .from('generations')
    .select('image_url, status')
    .eq('id', generationId)
    .eq('user_id', userId)
    .maybeSingle()

  if (fallback.error) {
    return { row: null, error: fallback.error }
  }

  return {
    row: fallback.data ? { ...(fallback.data as Omit<GenerationDownloadRow, 'storage_key'>), storage_key: null } : null,
    error: null,
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const { row, error: generationError } = await findGenerationForDownload(supabase, id, user.id)

    if (generationError) {
      console.error('Generation download lookup failed:', generationError)
      return NextResponse.json({ error: 'Download lookup failed.' }, { status: 500 })
    }

    if (!row || row.status !== 'completed') {
      return NextResponse.json({ error: 'Generated image not found.' }, { status: 404 })
    }

    const downloadUrl = row.storage_key
      ? await getSignedDownloadUrl(row.storage_key)
      : row.image_url

    if (!downloadUrl) {
      return NextResponse.json({ error: 'Generated image is unavailable.' }, { status: 404 })
    }

    const imageResponse = await fetch(downloadUrl)

    if (!imageResponse.ok) {
      console.error('Generated image fetch failed:', imageResponse.status)
      return NextResponse.json({ error: 'Generated image download failed.' }, { status: 502 })
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png'
    const fileExtension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png'
    const body = await imageResponse.arrayBuffer()

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="aivolo-${id}.${fileExtension}"`,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Generation download route failed:', error)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
