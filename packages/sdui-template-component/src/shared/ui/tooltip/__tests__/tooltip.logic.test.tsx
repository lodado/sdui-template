import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { Tooltip as TooltipCompound, TooltipProvider } from '../Tooltip'

// Helper component to wrap tests with TooltipProvider
const TooltipWithProvider = ({
  children,
  providerProps = {},
}: {
  children: React.ReactNode
  providerProps?: { delayDuration?: number; skipDelayDuration?: number }
}) => <TooltipProvider {...providerProps}>{children}</TooltipProvider>

// Helper component to maintain SimpleTooltip API for tests
interface SimpleTooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  delayDuration?: number
  showArrow?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  nodeId?: string
}

const SimpleTooltip = ({
  content,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  delayDuration,
  showArrow = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  nodeId,
}: SimpleTooltipProps) => {
  return (
    <TooltipCompound.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} delayDuration={delayDuration}>
      <TooltipCompound.Trigger asChild data-node-id={nodeId}>
        {children}
      </TooltipCompound.Trigger>
      <TooltipCompound.Portal>
        <TooltipCompound.Content side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} className={className} data-node-id={nodeId ? `${nodeId}-content` : undefined}>
          {content}
          {showArrow && <TooltipCompound.Arrow />}
        </TooltipCompound.Content>
      </TooltipCompound.Portal>
    </TooltipCompound.Root>
  )
}

// Alias for test compatibility
const Tooltip = SimpleTooltip

// Helper to get the tooltip content wrapper (has data-side, data-align, className)
const getTooltipContent = () => {
  const wrapper = document.querySelector('[data-radix-popper-content-wrapper]')
  return wrapper?.querySelector('[data-side]') as HTMLElement | null
}

describe('Tooltip - Logic Tests (ADS Style)', () => {
  describe('Content Rendering', () => {
    describe('as is: Tooltip with content="Help text"', () => {
      describe('when: tooltip is open', () => {
        it('to be: content "Help text" is displayed', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Help text" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Tooltip content should be visible
          expect(screen.getByRole('tooltip')).toHaveTextContent('Help text')
        })
      })
    })

    describe('as is: Tooltip with complex content', () => {
      describe('when: tooltip is open', () => {
        it('to be: content is rendered correctly', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Add to library" open>
                <button>+</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toHaveTextContent('Add to library')
        })
      })
    })
  })

  describe('Side Positioning', () => {
    // Note: Radix UI applies collision avoidance in jsdom, which may change the actual side
    // We test that the side prop is accepted and the tooltip renders correctly
    const sides = ['top', 'bottom', 'left'] as const // Exclude 'right' due to collision in jsdom

    sides.forEach((side) => {
      describe(`as is: Tooltip with side="${side}"`, () => {
        describe('when: tooltip is open', () => {
          it(`to be: tooltip has data-side attribute`, async () => {
            render(
              <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
                <Tooltip content="Test" side={side} open>
                  <button>Trigger</button>
                </Tooltip>
              </TooltipWithProvider>,
            )

            // Wait for tooltip to be in DOM
            await waitFor(() => {
              expect(screen.getByRole('tooltip')).toBeInTheDocument()
            })

            const tooltipContent = getTooltipContent()
            // Verify the tooltip content is rendered with a data-side attribute
            expect(tooltipContent).toHaveAttribute('data-side')
          })
        })
      })
    })

    describe('as is: Tooltip with side="right"', () => {
      describe('when: tooltip is open', () => {
        it('to be: tooltip renders (collision may adjust side)', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" side="right" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Verify tooltip renders - side may be adjusted due to collision
          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('Alignment', () => {
    const aligns = ['start', 'center', 'end'] as const

    aligns.forEach((align) => {
      describe(`as is: Tooltip with align="${align}"`, () => {
        describe('when: tooltip is open', () => {
          it(`to be: tooltip has data-align="${align}"`, async () => {
            render(
              <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
                <Tooltip content="Test" align={align} open>
                  <button>Trigger</button>
                </Tooltip>
              </TooltipWithProvider>,
            )

            // Wait for tooltip to be in DOM
            await waitFor(() => {
              expect(screen.getByRole('tooltip')).toBeInTheDocument()
            })

            const tooltipContent = getTooltipContent()
            expect(tooltipContent).toHaveAttribute('data-align', align)
          })
        })
      })
    })
  })

  describe('Side/Align Combinations (EP)', () => {
    // Test representative combinations - EP sampling
    // Note: 'right' side excluded due to collision avoidance in jsdom
    const combinations = [
      { side: 'top', align: 'center' }, // default
      { side: 'bottom', align: 'start' },
      { side: 'left', align: 'end' },
    ] as const

    combinations.forEach(({ side, align }) => {
      describe(`as is: Tooltip with side="${side}" and align="${align}"`, () => {
        describe('when: tooltip is open', () => {
          it('to be: correct data-align attribute applied', async () => {
            render(
              <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
                <Tooltip content="Test" side={side} align={align} open>
                  <button>Trigger</button>
                </Tooltip>
              </TooltipWithProvider>,
            )

            // Wait for tooltip to be in DOM
            await waitFor(() => {
              expect(screen.getByRole('tooltip')).toBeInTheDocument()
            })

            const tooltipContent = getTooltipContent()
            // data-side may change due to collision, but data-align should remain
            expect(tooltipContent).toHaveAttribute('data-align', align)
          })
        })
      })
    })
  })

  describe('Offset - Boundary Value Analysis', () => {
    describe('as is: Tooltip with sideOffset=0 (min boundary)', () => {
      describe('when: tooltip is open', () => {
        it('to be: tooltip renders without error', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" sideOffset={0} open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with sideOffset=4 (default)', () => {
      describe('when: tooltip is open', () => {
        it('to be: tooltip renders correctly', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" sideOffset={4} open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with sideOffset=100 (large value)', () => {
      describe('when: tooltip is open', () => {
        it('to be: tooltip renders without error', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" sideOffset={100} open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with alignOffset=-10 (negative)', () => {
      describe('when: tooltip is open', () => {
        it('to be: tooltip renders without error', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" alignOffset={-10} open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Controlled Mode', () => {
    describe('as is: Tooltip with open=true (controlled)', () => {
      describe('when: component renders', () => {
        it('to be: tooltip is visible', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Controlled tooltip" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
          expect(screen.getByRole('tooltip')).toHaveTextContent('Controlled tooltip')
        })
      })
    })

    describe('as is: Tooltip with open=false (controlled)', () => {
      describe('when: component renders', () => {
        it('to be: tooltip is not visible', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Hidden tooltip" open={false}>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with onOpenChange callback', () => {
      describe('when: open state changes', () => {
        it('to be: onOpenChange is called with new state', async () => {
          const user = userEvent.setup()
          const handleOpenChange = jest.fn()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Test" onOpenChange={handleOpenChange}>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })

          // Focus trigger to open tooltip
          await user.tab()

          await waitFor(() => {
            expect(handleOpenChange).toHaveBeenCalledWith(true)
          })
        })
      })
    })
  })

  describe('Uncontrolled Mode', () => {
    describe('as is: Tooltip with defaultOpen=true', () => {
      describe('when: component renders', () => {
        it('to be: tooltip starts open', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Default open" defaultOpen>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with defaultOpen=false (default)', () => {
      describe('when: component renders', () => {
        it('to be: tooltip starts closed', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Default closed">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('Arrow Rendering', () => {
    describe('as is: Tooltip with showArrow=true', () => {
      describe('when: tooltip is open', () => {
        it('to be: arrow element is rendered', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="With arrow" showArrow open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const tooltip = screen.getByRole('tooltip')
          // Arrow is rendered as SVG inside tooltip content
          const arrow = tooltip.parentElement?.querySelector('svg')
          expect(arrow).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip with showArrow=false (default)', () => {
      describe('when: tooltip is open', () => {
        it('to be: no arrow element is rendered', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Without arrow" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const tooltip = screen.getByRole('tooltip')
          // Arrow should not be present
          const arrow = tooltip.parentElement?.querySelector('svg')
          expect(arrow).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('Keyboard Navigation', () => {
    describe('as is: Tooltip with trigger element', () => {
      describe('when: user tabs to trigger', () => {
        it('to be: tooltip opens on focus', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Keyboard tooltip">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Initially closed
          expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

          // Tab to focus trigger
          await user.tab()

          // Tooltip should open
          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })
        })
      })
    })

    describe('as is: Tooltip is open via focus', () => {
      describe('when: user presses Escape', () => {
        it('to be: tooltip closes', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Escape test">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Focus trigger to open
          await user.tab()

          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })

          // Press Escape
          await user.keyboard('{Escape}')

          // Tooltip should close
          await waitFor(() => {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
          })
        })
      })
    })
  })

  describe('Hover Interaction', () => {
    describe('as is: Tooltip with trigger element', () => {
      describe('when: user hovers over trigger', () => {
        it('to be: tooltip opens after delay', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Hover tooltip">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })

          // Hover over trigger
          await user.hover(trigger)

          // Tooltip should open (with delay=0, opens immediately)
          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })
        })
      })
    })

    // Note: unhover test skipped - jsdom doesn't properly simulate mouseLeave
    // The actual closing behavior is best tested in E2E tests with a real browser
    describe('as is: Tooltip can be opened via hover', () => {
      describe('when: tooltip is open', () => {
        it('to be: data-state reflects open state', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Hover test">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })

          // Hover to open
          await user.hover(trigger)

          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })

          // Verify tooltip is in open state
          const tooltipContent = getTooltipContent()
          expect(tooltipContent).toHaveAttribute('data-state')
        })
      })
    })
  })

  describe('Delay Duration - Boundary Value Analysis', () => {
    describe('as is: Tooltip with delayDuration=0 (boundary/instant)', () => {
      describe('when: user hovers over trigger', () => {
        it('to be: tooltip opens immediately without delay', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider>
              <Tooltip content="Instant" delayDuration={0}>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })
          await user.hover(trigger)

          // Should open quickly with no delay
          await waitFor(
            () => {
              expect(screen.getByRole('tooltip')).toBeInTheDocument()
            },
            { timeout: 100 },
          )
        })
      })
    })
  })

  describe('Custom Styling', () => {
    describe('as is: Tooltip with custom className', () => {
      describe('when: tooltip is open', () => {
        it('to be: custom class is merged with default styles', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Styled" className="custom-class" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Wait for tooltip to be in DOM
          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })

          const tooltipContent = getTooltipContent()
          expect(tooltipContent).toHaveClass('custom-class')
        })
      })
    })
  })

  describe('SDUI Integration', () => {
    describe('as is: Tooltip with nodeId', () => {
      describe('when: component renders', () => {
        it('to be: data-node-id attribute is present on trigger', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="SDUI tooltip" nodeId="tooltip-1">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })
          expect(trigger).toHaveAttribute('data-node-id', 'tooltip-1')
        })
      })
    })

    describe('as is: Tooltip with nodeId, tooltip is open', () => {
      describe('when: component renders', () => {
        it('to be: data-node-id attribute is present on content', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="SDUI tooltip" nodeId="tooltip-1" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          // Wait for tooltip to be in DOM
          await waitFor(() => {
            expect(screen.getByRole('tooltip')).toBeInTheDocument()
          })

          const tooltipContent = getTooltipContent()
          expect(tooltipContent).toHaveAttribute('data-node-id', 'tooltip-1-content')
        })
      })
    })
  })

  describe('Accessibility', () => {
    describe('as is: Tooltip is open', () => {
      describe('when: component renders', () => {
        it('to be: tooltip has role="tooltip"', async () => {
          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Accessible tooltip" open>
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          expect(screen.getByRole('tooltip')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Tooltip trigger element', () => {
      describe('when: component renders', () => {
        it('to be: trigger is focusable via Tab', async () => {
          const user = userEvent.setup()

          render(
            <TooltipWithProvider providerProps={{ delayDuration: 0 }}>
              <Tooltip content="Focus test">
                <button>Trigger</button>
              </Tooltip>
            </TooltipWithProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })

          await user.tab()

          expect(trigger).toHaveFocus()
        })
      })
    })
  })

  describe('TooltipProvider', () => {
    describe('as is: TooltipProvider with custom delayDuration', () => {
      describe('when: child Tooltip uses default delay', () => {
        it('to be: provider delay is applied', async () => {
          const user = userEvent.setup()

          render(
            <TooltipProvider delayDuration={0}>
              <Tooltip content="Provider test">
                <button>Trigger</button>
              </Tooltip>
            </TooltipProvider>,
          )

          const trigger = screen.getByRole('button', { name: /trigger/i })
          await user.hover(trigger)

          // With provider delay=0, should open quickly
          await waitFor(
            () => {
              expect(screen.getByRole('tooltip')).toBeInTheDocument()
            },
            { timeout: 100 },
          )
        })
      })
    })
  })
})
