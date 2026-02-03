import { isServerSide } from '../isServerSide'
import { parseServerCookie } from './parseServerCookie'

class MockController {
  abort() {}
}

/**
 * Request function for data fetching.
 * Provide data (body) as a string.
 * baseUrl must be injected by each app (server: from headers, browser: window.location.origin).
 */
export const request = async <T>({
  method = 'GET',
  url = '',
  baseUrl,
  headers = {},
  data,
  params,
  timeout = 5000,
  isSignalRequired = true,
  isClientServer = false,

  ...options
}: {
  url: string
  baseUrl: string
  data?: Record<string, unknown> | Array<unknown> | FormData | string
  params?: Record<string, unknown>
  timeout?: number
  isSignalRequired?: boolean
  isClientServer?: boolean
} & Parameters<typeof fetch>[1]): Promise<T> => {
  const controller = isServerSide() ? new AbortController() : (new MockController() as AbortController)

  const body = ['GET', 'HEAD'].includes(method) ? undefined : data
  const requestHeaders: Record<string, any> = { 'Content-Type': 'application/json', ...headers }

  if (!isServerSide()) {
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, timeout)
    timeoutId?.unref?.()
  } else {
    /**
     * Server components can omit cookie info when calling server APIs, so we set it explicitly.
     */
    const cookieString = await parseServerCookie()

    requestHeaders.Cookie = cookieString
  }

  const urlObject = new URL(url, baseUrl)

  if (params) {
    const searchParams = new URLSearchParams(params as Record<string, string>)
    urlObject.search = searchParams.toString()
  }

  const response = await fetch(urlObject.toString(), {
    method,
    body: body as any,
    headers: requestHeaders,
    ...(!isServerSide() && isSignalRequired ? { signal: controller.signal } : {}),

    /** Behaves oddly during ISR */
    cache: 'no-cache',
    ...options,
  })

  const responseData = await response.json()

  if (!response.ok) {
    const error = new Error(`Failed to fetch ${response.url} ${response.status} ${response.statusText}`)

    ;(error as any).code = responseData.code

    throw error
  }

  return responseData
}
