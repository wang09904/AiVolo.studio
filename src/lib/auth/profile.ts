import type { SupabaseClient, User } from '@supabase/supabase-js'

export type UserProfile = {
  email: string | null
  name: string | null
  avatar: string | null
  credits_balance: number
  created_at?: string
}

export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ profile: UserProfile | null; error: unknown | null }> {
  const rpcPayload = {
    p_user_id: user.id,
    p_email: user.email ?? null,
    p_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    p_avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
  }

  const { data: rpcProfile, error: rpcError } = await supabase.rpc('ensure_user_profile', rpcPayload)

  if (!rpcError && Array.isArray(rpcProfile) && rpcProfile[0]) {
    return {
      profile: rpcProfile[0] as UserProfile,
      error: null,
    }
  }

  const selectProfile = () =>
    supabase
      .from('users')
      .select('email, name, avatar, credits_balance, created_at')
      .eq('id', user.id)
      .maybeSingle()

  const { data: existingProfile, error: selectError } = await selectProfile()

  if (existingProfile) {
    const profile = existingProfile as UserProfile

    if ((profile.credits_balance ?? 0) === 0) {
      const { count, error: countError } = await supabase
        .from('credits_transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (countError) {
        return { profile: null, error: countError }
      }

      if (count === 0) {
        const { error: updateError } = await supabase
          .from('users')
          .update({ credits_balance: 20 })
          .eq('id', user.id)

        if (updateError) {
          return { profile: null, error: updateError }
        }

        await supabase.from('credits_transactions').insert({
          user_id: user.id,
          amount: 20,
          type: 'credit',
          description: 'New user free credits',
        })

        return {
          profile: { ...profile, credits_balance: 20 },
          error: null,
        }
      }
    }

    return { profile, error: null }
  }

  if (selectError) {
    return { profile: null, error: selectError }
  }

  const profileToInsert = {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    credits_balance: 20,
  }

  const { data: insertedProfile, error: insertError } = await supabase
    .from('users')
    .insert(profileToInsert)
    .select('email, name, avatar, credits_balance, created_at')
    .single()

  if (insertError) {
    return { profile: null, error: insertError }
  }

  const { error: transactionError } = await supabase.from('credits_transactions').insert({
    user_id: user.id,
    amount: 20,
    type: 'credit',
    description: 'New user free credits',
  })

  if (transactionError) {
    console.error('Failed to create initial credits transaction:', transactionError)
  }

  return {
    profile: insertedProfile as UserProfile,
    error: null,
  }
}
