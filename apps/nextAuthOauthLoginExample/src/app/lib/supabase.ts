import { createClient } from '@supabase/supabase-js'

import { requireEnv } from './env'

const supabaseUrl = requireEnv('SUPABASE_URL')
const supabaseServiceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
})

export async function persistUserAvatar(params: {
  userId: string
  imageUrl?: string | null
}) {
  const { userId, imageUrl } = params

  if (!imageUrl) {
    return
  }

  const response = await fetch(imageUrl)
  if (!response.ok) {
    return
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  await supabaseAdmin.storage.from('avatars').upload(`${userId}`, buffer, {
    contentType,
    upsert: true,
  })
}
