import type { ComponentFactory } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { render, screen, waitFor } from '@testing-library/react'
import React, { lazy, Suspense } from 'react'

import { Div } from '../Div'
import { ErrorBoundary } from '../ErrorBoundary'

// Utility function to create test document
function createTestDocument(overrides?: {
  root?: {
    id: string
    type: string
    children?: Array<{
      id: string
      type: string
      children?: Array<{ id: string; type: string }>
      attributes?: Record<string, unknown>
    }>
    attributes?: Record<string, unknown>
  }
}) {
  const defaultRoot = {
    id: 'root',
    type: 'Container',
    children: [],
  }

  const mergedRoot = overrides?.root
    ? {
        ...defaultRoot,
        ...overrides.root,
      }
    : defaultRoot

  return {
    version: '1.0.0',
    metadata: {
      id: 'test-doc',
      name: 'Test Document',
    },
    root: mergedRoot,
  }
}

// Convert Div component to component factory
const divComponentFactory: ComponentFactory = (id, parentPath) => <Div id={id} parentPath={parentPath} />

describe('Div - Logic Tests', () => {
  describe('as is: Div with default configuration', () => {
    describe('when: component renders with id only, no children', () => {
      it('to be: renders as div element with correct attributes, should have data-node-id and data-testid', () => {
        const document = createTestDocument({
          root: {
            id: 'div-1',
            type: 'Div',
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const div = screen.getByTestId('div-div-1')
        expect(div).toBeInTheDocument()
        expect(div.tagName).toBe('DIV')
        expect(div).toHaveAttribute('data-node-id', 'div-1')
        expect(div).toHaveAttribute('data-testid', 'div-div-1')
      })
    })
  })

  describe('as is: Div with empty childrenIds', () => {
    describe('when: childrenIds is empty array', () => {
      it('to be: renders empty div, should be empty DOM element', () => {
        const document = createTestDocument({
          root: {
            id: 'div-empty',
            type: 'Div',
            children: [],
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const div = screen.getByTestId('div-div-empty')
        expect(div).toBeInTheDocument()
        expect(div).toBeEmptyDOMElement()
      })
    })
  })

  describe('as is: Div with single child', () => {
    describe('when: childrenIds contains one childId', () => {
      it('to be: renders child element, should display child content', () => {
        // Simple component factory to render child
        const textComponentFactory: ComponentFactory = (id) => <span data-testid={`text-${id}`}>Child Content</span>

        const document = createTestDocument({
          root: {
            id: 'div-parent',
            type: 'Div',
            children: [
              {
                id: 'child-1',
                type: 'Text',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, Text: textComponentFactory }}
          />,
        )

        expect(screen.getByTestId('div-div-parent')).toBeInTheDocument()
        expect(screen.getByTestId('text-child-1')).toBeInTheDocument()
        expect(screen.getByText('Child Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with multiple children', () => {
    describe('when: childrenIds contains multiple childIds', () => {
      it('to be: renders all children in order, should display all child contents', () => {
        const textComponentFactory: ComponentFactory = (id) => <span data-testid={`text-${id}`}>Child {id}</span>

        const document = createTestDocument({
          root: {
            id: 'div-multi',
            type: 'Div',
            children: [
              {
                id: 'child-1',
                type: 'Text',
              },
              {
                id: 'child-2',
                type: 'Text',
              },
              {
                id: 'child-3',
                type: 'Text',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, Text: textComponentFactory }}
          />,
        )

        expect(screen.getByText('Child child-1')).toBeInTheDocument()
        expect(screen.getByText('Child child-2')).toBeInTheDocument()
        expect(screen.getByText('Child child-3')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with custom element type via attributes', () => {
    describe('when: attributes.as="section" provided', () => {
      it('to be: renders as section element, should have correct tag name', () => {
        const document = createTestDocument({
          root: {
            id: 'div-section',
            type: 'Div',
            attributes: {
              as: 'section',
            },
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const element = screen.getByTestId('div-div-section')
        expect(element.tagName).toBe('SECTION')
        expect(element).toHaveAttribute('data-node-id', 'div-section')
      })
    })
  })

  describe('as is: Div with className in attributes', () => {
    describe('when: attributes.className="custom-class" provided', () => {
      it('to be: className applied to element, should have custom-class in classList', () => {
        const document = createTestDocument({
          root: {
            id: 'div-class',
            type: 'Div',
            attributes: {
              className: 'custom-class',
            },
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const div = screen.getByTestId('div-div-class')
        expect(div).toHaveClass('custom-class')
      })
    })
  })

  describe('as is: Div with nested children structure', () => {
    describe('when: Div contains another Div as child', () => {
      it('to be: renders nested structure correctly, should display both parent and child', () => {
        const document = createTestDocument({
          root: {
            id: 'div-parent',
            type: 'Div',
            children: [
              {
                id: 'div-child',
                type: 'Div',
                children: [],
              },
            ],
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const parentDiv = screen.getByTestId('div-div-parent')
        const childDiv = screen.getByTestId('div-div-child')

        expect(parentDiv).toBeInTheDocument()
        expect(childDiv).toBeInTheDocument()
        expect(parentDiv).toContainElement(childDiv)
      })
    })
  })

  describe('as is: Div with multiple nested levels', () => {
    describe('when: Div contains Div which contains Text', () => {
      it('to be: renders all levels correctly, should display nested content', () => {
        const textComponentFactory: ComponentFactory = (id) => <span data-testid={`text-${id}`}>Nested Text</span>

        const document = createTestDocument({
          root: {
            id: 'div-level1',
            type: 'Div',
            children: [
              {
                id: 'div-level2',
                type: 'Div',
                children: [
                  {
                    id: 'text-level3',
                    type: 'Text',
                  },
                ],
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, Text: textComponentFactory }}
          />,
        )

        expect(screen.getByTestId('div-div-level1')).toBeInTheDocument()
        expect(screen.getByTestId('div-div-level2')).toBeInTheDocument()
        expect(screen.getByTestId('text-text-level3')).toBeInTheDocument()
        expect(screen.getByText('Nested Text')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with className and custom element type', () => {
    describe('when: attributes.className="container" and attributes.as="main" both provided', () => {
      it('to be: both className and element type applied, should have container class and main tag', () => {
        const document = createTestDocument({
          root: {
            id: 'div-combined',
            type: 'Div',
            attributes: {
              className: 'container',
              as: 'main',
            },
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ Div: divComponentFactory }} />)

        const element = screen.getByTestId('div-div-combined')
        expect(element.tagName).toBe('MAIN')
        expect(element).toHaveClass('container')
      })
    })
  })

  describe('as is: Div with multiple children of different types', () => {
    describe('when: Div contains Text and another Div as children', () => {
      it('to be: renders all children correctly, should display both text and nested div', () => {
        const textComponentFactory: ComponentFactory = (id) => <span data-testid={`text-${id}`}>Text Content</span>

        const document = createTestDocument({
          root: {
            id: 'div-mixed',
            type: 'Div',
            children: [
              {
                id: 'text-1',
                type: 'Text',
              },
              {
                id: 'div-nested',
                type: 'Div',
                children: [],
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, Text: textComponentFactory }}
          />,
        )

        expect(screen.getByTestId('div-div-mixed')).toBeInTheDocument()
        expect(screen.getByTestId('text-text-1')).toBeInTheDocument()
        expect(screen.getByTestId('div-div-nested')).toBeInTheDocument()
        expect(screen.getByText('Text Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with ErrorBoundary', () => {
    describe('when: child component throws an error', () => {
      it('to be: default error fallback displayed, should show "Something went wrong" message', () => {
        // Component that intentionally throws an error to test ErrorBoundary
        const ErrorComponent = () => {
          throw new Error('Test error')
        }

        const errorComponentFactory: ComponentFactory = () => <ErrorComponent />

        const document = createTestDocument({
          root: {
            id: 'div-error',
            type: 'Div',
            children: [
              {
                id: 'error-child',
                type: 'ErrorComponent',
              },
            ],
          },
        })

        // ErrorBoundary can catch errors as it's a class component
        render(
          <ErrorBoundary>
            <SduiLayoutRenderer
              document={document}
              components={{ Div: divComponentFactory, ErrorComponent: errorComponentFactory }}
            />
          </ErrorBoundary>,
        )

        // Default fallback UI should be displayed
        expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument()
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      })
    })

    describe('when: child component throws an error with custom errorFallback', () => {
      it('to be: custom error fallback displayed, should show custom error message', () => {
        const ErrorComponent = () => {
          throw new Error('Test error')
        }

        const errorComponentFactory: ComponentFactory = () => <ErrorComponent />

        const customErrorFallback = <div data-testid="custom-error">Custom Error Message</div>

        const document = createTestDocument({
          root: {
            id: 'div-error-custom',
            type: 'Div',
            children: [
              {
                id: 'error-child',
                type: 'ErrorComponent',
              },
            ],
          },
        })

        // Use custom factory to pass errorFallback prop to Div component
        const divWithErrorFallbackFactory: ComponentFactory = (id, parentPath) => (
          <Div id={id} parentPath={parentPath} errorFallback={customErrorFallback} />
        )

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divWithErrorFallbackFactory, ErrorComponent: errorComponentFactory }}
          />,
        )

        // Custom fallback UI should be displayed
        expect(screen.getByTestId('custom-error')).toBeInTheDocument()
        expect(screen.getByText('Custom Error Message')).toBeInTheDocument()
      })
    })

    describe('when: child component throws an error with onError callback', () => {
      it('to be: onError callback called, should receive error and errorInfo', () => {
        const ErrorComponent = () => {
          throw new Error('Test error')
        }

        const errorComponentFactory: ComponentFactory = () => <ErrorComponent />

        const onErrorMock = jest.fn()

        const document = createTestDocument({
          root: {
            id: 'div-error-callback',
            type: 'Div',
            children: [
              {
                id: 'error-child',
                type: 'ErrorComponent',
              },
            ],
          },
        })

        const divWithOnErrorFactory: ComponentFactory = (id, parentPath) => (
          <Div id={id} parentPath={parentPath} onError={onErrorMock} />
        )

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divWithOnErrorFactory, ErrorComponent: errorComponentFactory }}
          />,
        )

        // onError callback should be called
        expect(onErrorMock).toHaveBeenCalled()
        expect(onErrorMock).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.any(String),
          }),
          expect.objectContaining({
            componentStack: expect.any(String),
          }),
        )
      })
    })
  })

  describe('as is: Div with Suspense', () => {
    describe('when: child component is lazy loaded', () => {
      it('to be: suspense fallback displayed during loading, should show fallback UI', async () => {
        // Create async component
        const LazyComponent = lazy(() =>
          Promise.resolve({
            default: () => <div data-testid="lazy-content">Lazy Loaded Content</div>,
          }),
        )

        const lazyComponentFactory: ComponentFactory = () => (
          <Suspense fallback={<div data-testid="loading">Loading...</div>}>
            <LazyComponent />
          </Suspense>
        )

        const document = createTestDocument({
          root: {
            id: 'div-suspense',
            type: 'Div',
            children: [
              {
                id: 'lazy-child',
                type: 'LazyComponent',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, LazyComponent: lazyComponentFactory }}
          />,
        )

        // Suspense fallback should be displayed first
        expect(screen.getByTestId('loading')).toBeInTheDocument()
        expect(screen.getByText('Loading...')).toBeInTheDocument()

        // Content should be displayed after async component loads
        await waitFor(() => {
          expect(screen.getByTestId('lazy-content')).toBeInTheDocument()
        })

        expect(screen.getByText('Lazy Loaded Content')).toBeInTheDocument()
      })
    })

    describe('when: Div has custom suspenseFallback prop', () => {
      it('to be: custom suspense fallback displayed, should show custom loading message', async () => {
        const LazyComponent = lazy(() =>
          Promise.resolve({
            default: () => <div data-testid="lazy-content">Lazy Content</div>,
          }),
        )

        const lazyComponentFactory: ComponentFactory = () => <LazyComponent />

        const customSuspenseFallback = <div data-testid="custom-loading">Custom Loading...</div>

        const document = createTestDocument({
          root: {
            id: 'div-suspense-custom',
            type: 'Div',
            children: [
              {
                id: 'lazy-child',
                type: 'LazyComponent',
              },
            ],
          },
        })

        // Pass suspenseFallback prop to Div component
        const divWithSuspenseFallbackFactory: ComponentFactory = (id, parentPath) => (
          <Div id={id} parentPath={parentPath} suspenseFallback={customSuspenseFallback} />
        )

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divWithSuspenseFallbackFactory, LazyComponent: lazyComponentFactory }}
          />,
        )

        // Custom Suspense fallback should be displayed
        expect(screen.getByTestId('custom-loading')).toBeInTheDocument()
        expect(screen.getByText('Custom Loading...')).toBeInTheDocument()

        // Content should be displayed after async component loads
        await waitFor(() => {
          expect(screen.getByTestId('lazy-content')).toBeInTheDocument()
        })
      })
    })

    describe('when: Div has no suspenseFallback prop', () => {
      it('to be: no fallback displayed, should render children directly when no async components', () => {
        const textComponentFactory: ComponentFactory = (id) => <span data-testid={`text-${id}`}>Sync Content</span>

        const document = createTestDocument({
          root: {
            id: 'div-sync',
            type: 'Div',
            children: [
              {
                id: 'sync-child',
                type: 'Text',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divComponentFactory, Text: textComponentFactory }}
          />,
        )

        // Sync component should render immediately
        expect(screen.getByTestId('text-sync-child')).toBeInTheDocument()
        expect(screen.getByText('Sync Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Div with both ErrorBoundary and Suspense', () => {
    describe('when: lazy component throws error during loading', () => {
      it('to be: error boundary catches error, should show error fallback instead of suspense fallback', async () => {
        // Lazy component that intentionally throws an error to test ErrorBoundary with Suspense
        const ErrorLazyComponent = lazy(() =>
          Promise.resolve({
            default: () => {
              throw new Error('Lazy component error')
            },
          }),
        )

        const errorLazyComponentFactory: ComponentFactory = () => <ErrorLazyComponent />

        const customErrorFallback = <div data-testid="error-fallback">Error occurred</div>
        const customSuspenseFallback = <div data-testid="suspense-fallback">Loading...</div>

        const document = createTestDocument({
          root: {
            id: 'div-both',
            type: 'Div',
            children: [
              {
                id: 'error-lazy-child',
                type: 'ErrorLazyComponent',
              },
            ],
          },
        })

        const divWithBothFactory: ComponentFactory = (id, parentPath) => (
          <Div
            id={id}
            parentPath={parentPath}
            errorFallback={customErrorFallback}
            suspenseFallback={customSuspenseFallback}
          />
        )

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Div: divWithBothFactory, ErrorLazyComponent: errorLazyComponentFactory }}
          />,
        )

        // Suspense fallback may be displayed first, but ErrorBoundary should catch the error
        // and display error fallback instead
        await waitFor(
          () => {
            // Error fallback should be displayed
            expect(screen.getByTestId('error-fallback')).toBeInTheDocument()
          },
          { timeout: 3000 },
        )

        expect(screen.getByText('Error occurred')).toBeInTheDocument()
        // Suspense fallback should not be displayed when error occurs
        expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument()
      })
    })
  })
})
