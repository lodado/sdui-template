import crypto from 'crypto'

import { supabaseAdmin } from './supabase'

const REFRESH_TOKEN_TABLE = 'auth_refresh_tokens'
export const refreshTokenMaxAgeSeconds = 60 * 60 * 24 * 30

export type RefreshTokenRecord = {
  id: string
  token_hash: string
  user_id: string
  user_email: string | null
  user_name: string | null
  user_image: string | null
  expires_at: string
  revoked_at: string | null
  replaced_by_token_hash: string | null
}

export function createRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export async function storeRefreshToken(params: {
  token: string
  user: {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
  }
}) {
  const { token, user } = params
  const tokenHash = hashRefreshToken(token)
  const expiresAt = new Date(Date.now() + refreshTokenMaxAgeSeconds * 1000).toISOString()

  const { error } = await supabaseAdmin.from(REFRESH_TOKEN_TABLE).insert({
    token_hash: tokenHash,
    user_id: user.id,
    user_email: user.email ?? null,
    user_name: user.name ?? null,
    user_image: user.image ?? null,
    expires_at: expiresAt,
  })

  if (error) {
    throw new Error(`Failed to store refresh token: ${error.message}`)
  }
}

export async function findRefreshToken(token: string): Promise<RefreshTokenRecord | null> {
  const tokenHash = hashRefreshToken(token)

  const { data, error } = await supabaseAdmin
    .from(REFRESH_TOKEN_TABLE)
    .select('*')
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  if (new Date(data.expires_at) < new Date()) {
    return null
  }

  return data as RefreshTokenRecord
}

export async function rotateRefreshToken(params: {
  previousToken: RefreshTokenRecord
  nextToken: string
}) {
  const { previousToken, nextToken } = params
  const nextTokenHash = hashRefreshToken(nextToken)
  const now = new Date().toISOString()

  const { error: updateError } = await supabaseAdmin
    .from(REFRESH_TOKEN_TABLE)
    .update({
      revoked_at: now,
      replaced_by_token_hash: nextTokenHash,
    })
    .eq('id', previousToken.id)

  if (updateError) {
    throw new Error(`Failed to revoke refresh token: ${updateError.message}`)
  }

  const { error: insertError } = await supabaseAdmin.from(REFRESH_TOKEN_TABLE).insert({
    token_hash: nextTokenHash,
    user_id: previousToken.user_id,
    user_email: previousToken.user_email,
    user_name: previousToken.user_name,
    user_image: previousToken.user_image,
    expires_at: new Date(Date.now() + refreshTokenMaxAgeSeconds * 1000).toISOString(),
  })

  if (insertError) {
    throw new Error(`Failed to rotate refresh token: ${insertError.message}`)
  }
}
