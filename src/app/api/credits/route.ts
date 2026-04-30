import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'
import { ensureUserProfile } from '@/lib/auth/profile'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const { profile, error: profileError } = await ensureUserProfile(supabase, user)

    if (profileError || !profile) {
      console.error('User profile initialization failed:', profileError)
      return NextResponse.json(
        {
          error: 'Failed to initialize user credits',
          details: profileError instanceof Error ? profileError.message : profileError,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ credits: profile.credits_balance ?? 0 })
  } catch (error) {
    console.error('Credits route failed:', error)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
