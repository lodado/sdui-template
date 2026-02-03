import type { ErrorPolicy, ErrorSituation } from './types'

/**
 * Alert Error Policy
 * Policy that notifies users via a browser alert when an error occurs.
 */
export class AlertErrorPolicy implements ErrorPolicy {
  constructor(
    private options: {
      /** Whether to show alerts only during the catch phase */
      onlyOnCatch?: boolean
      /** Alert message formatting function */
      formatMessage?: (situation: ErrorSituation) => string
    } = {}
  ) {
    this.options = {
      onlyOnCatch: true,
      formatMessage: (situation: ErrorSituation) => {
        const { error, context } = situation
        const nodeInfo = context.nodeId ? ` (Node: ${context.nodeId})` : ''
        return `에러가 발생했습니다:\n\n${error.message}${nodeInfo}`
      },
      ...options,
    }
  }

  handleSituation(situation: ErrorSituation): void {
    // Ignore when onlyOnCatch is true and this is not the catch phase
    if (this.options.onlyOnCatch && situation.lifecycle.phase !== 'catch') {
      return
    }

    const message = this.options.formatMessage!(situation)
    alert(message)
  }
}
