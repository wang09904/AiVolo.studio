import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('credits_transactions')
      .select('id, type, amount, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Credit transaction lookup failed:', error)
      return NextResponse.json({ error: 'Credit activity is unavailable.' }, { status: 500 })
    }

    return NextResponse.json({ transactions: data || [] })
  } catch (error) {
    console.error('Credit transactions route failed:', error)
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
