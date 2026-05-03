import { NextRequest, NextResponse } from 'next/server'
import { E2E_MOCK_IMAGE_BASE64, isE2EMockMode } from '@/lib/e2e/mockGeneration'
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
    const fileId = id.slice(0, 8)
    const asInlineAsset = _request.nextUrl.searchParams.get('inline') === '1'

    if (isE2EMockMode()) {
      const body = Buffer.from(E2E_MOCK_IMAGE_BASE64, 'base64')

      return new NextResponse(body, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="aivolo-${fileId}.png"`,
          'Content-Length': String(body.byteLength),
          'Cache-Control': 'private, no-store',
        },
      })
    }

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

    if (!row) {
      return NextResponse.json({ error: 'Generated image not found.' }, { status: 404 })
    }

    if (row.status === 'failed') {
      return NextResponse.json({ error: 'Generated image is unavailable.' }, { status: 404 })
    }

    if (row.status === 'pending') {
      return NextResponse.json({ error: 'Generated image is not ready yet.' }, { status: 409 })
    }

    if (row.storage_key) {
      const contentDisposition = `${asInlineAsset ? 'inline' : 'attachment'}; filename="aivolo-${fileId}.png"`
      const signedUrl = await getSignedDownloadUrl(row.storage_key, 86400, contentDisposition)
      return NextResponse.redirect(signedUrl)
    }

    if (!row.image_url) {
      return NextResponse.json({ error: 'Generated image is unavailable.' }, { status: 404 })
    }

    return NextResponse.redirect(row.image_url)
  } catch (error) {
    console.error('Generation download route failed:', error)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
