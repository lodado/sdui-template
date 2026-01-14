import { cache } from 'react'

const rawParseServerCookie = async () => {
  const cookieString = (await import('next/headers'))
    .cookies()
    .getAll()
    .filter(({ name }) => /authjs/.test(name))

    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  return cookieString
}

export const parseServerCookie = async () => {
  return rawParseServerCookie()
}
