import React, { useContext } from 'react'

/** Host-provided embed policy. Empty allowlist (default) blocks every iframe. */
export type SduiEmbedConfig = {
  allowedHosts: string[]
}

const EmbedConfigContext = React.createContext<SduiEmbedConfig>({ allowedHosts: [] })

export const SduiEmbedConfigProvider = EmbedConfigContext.Provider

export function useEmbedConfig(): SduiEmbedConfig {
  return useContext(EmbedConfigContext)
}

/** Whether `url`'s host is on the allowlist (exact host or subdomain of one). */
export function isEmbedAllowed(url: string, allowedHosts: string[]): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return allowedHosts.some((allowed) => {
      const a = allowed.toLowerCase()
      return host === a || host.endsWith(`.${a}`)
    })
  } catch {
    return false
  }
}
