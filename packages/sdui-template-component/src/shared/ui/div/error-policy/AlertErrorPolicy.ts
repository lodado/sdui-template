import type { ErrorPolicy, ErrorSituation } from './types'

/**
 * Alert Error Policy
 * 에러 발생 시 브라우저 alert로 사용자에게 알림을 표시하는 Policy
 */
export class AlertErrorPolicy implements ErrorPolicy {
  constructor(
    private options: {
      /** catch 단계에서만 alert 표시할지 여부 */
      onlyOnCatch?: boolean
      /** alert 메시지 포맷 함수 */
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
    // onlyOnCatch가 true이고 catch 단계가 아니면 무시
    if (this.options.onlyOnCatch && situation.lifecycle.phase !== 'catch') {
      return
    }

    const message = this.options.formatMessage!(situation)
    alert(message)
  }
}
