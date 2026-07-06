import * as Tooltip from '@radix-ui/react-tooltip'
import React from 'react'

export type ShortcutTooltipProps = {
  label: string
  shortcut?: string
  side?: React.ComponentProps<typeof Tooltip.Content>['side']
  children: React.ReactElement
}

export const formatShortcut = (shortcut: string) =>
  shortcut
    .replace(/^Mod-/, 'Ctrl/Cmd+')
    .replace(/^Shift-Ctrl-/, 'Ctrl+Shift+')
    .replace(/^Ctrl-Shift-/, 'Ctrl+Shift+')
    .split('-')
    .join('+')

const ShortcutTooltip = ({ label, shortcut, side = 'right', children }: ShortcutTooltipProps) => {
  if (!shortcut) return children

  return (
    <Tooltip.Provider delayDuration={250} skipDelayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="sdui-doc-shortcut-tooltip" side={side} align="center" sideOffset={10}>
            <span>{label}</span>
            <kbd>{shortcut}</kbd>
            <Tooltip.Arrow className="sdui-doc-shortcut-tooltip-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export default ShortcutTooltip
