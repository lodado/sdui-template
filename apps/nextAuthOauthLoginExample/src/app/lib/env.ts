export function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const isProduction = process.env.NODE_ENV === 'production'
