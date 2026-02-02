import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { renderWithSduiLayout } from '@lodado/sdui-template/test'
import { screen } from '@testing-library/react'
import React from 'react'

import { sduiComponents } from '../../../app/sduiComponents'
// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    <img src={src} alt={alt} data-testid="next-image" {...props} />
  ),
}))

// Simple SVG icon as data URI for testing (similar to Storybook)
const testLogoSvg = `data:image/svg+xml;base64,${btoa(
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}`

describe('Title - SDUI Integration Tests', () => {
  describe('as is: Title with minimal document', () => {
    describe('when: rendered via SDUI with empty children array', () => {
      it('to be: component renders correctly, should have correct DOM structure and testid', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()
        expect(title.tagName).toBe('HEADER')
        expect(title).toHaveAttribute('data-node-id', 'title-root')
      })
    })
  })

  describe('as is: Title with TitleLeft section', () => {
    describe('when: TitleLeft contains TitleLogo child', () => {
      it('to be: TitleLeft and TitleLogo render correctly, should display logo in left section', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Company Logo',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        const logo = screen.getByTestId('title-logo-logo')
        expect(logo).toBeInTheDocument()

        const logoImage = screen.getByAltText('Company Logo')
        expect(logoImage).toBeInTheDocument()
        expect(logoImage).toHaveAttribute('src', testLogoSvg)
      })
    })

    describe('when: TitleLeft contains multiple children (boundary: multiple children)', () => {
      it('to be: all children render in left section, should display all content', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo-1',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Logo 1',
                    },
                  },
                  {
                    id: 'text-1',
                    type: 'Text',
                    state: {
                      text: 'Left Text',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByTestId('title-logo-logo-1')).toBeInTheDocument()
        expect(screen.getByText('Left Text')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with TitleMiddle section', () => {
    describe('when: TitleMiddle contains Text child', () => {
      it('to be: TitleMiddle renders correctly, should display content in middle section', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-middle',
                type: 'TitleMiddle',
                children: [
                  {
                    id: 'middle-text',
                    type: 'Text',
                    state: {
                      text: 'Middle Content',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByText('Middle Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with TitleRight section', () => {
    describe('when: TitleRight contains Text child', () => {
      it('to be: TitleRight renders correctly, should display content in right section', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-right',
                type: 'TitleRight',
                children: [
                  {
                    id: 'right-text',
                    type: 'Text',
                    state: {
                      text: 'Right Content',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByText('Right Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with all three sections (TitleLeft, TitleMiddle, TitleRight)', () => {
    describe('when: Title contains TitleLeft, TitleMiddle, and TitleRight children', () => {
      it('to be: all three sections render correctly, should display content in left, middle, and right sections', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Company Logo',
                    },
                  },
                ],
              },
              {
                id: 'title-middle',
                type: 'TitleMiddle',
                children: [
                  {
                    id: 'middle-text',
                    type: 'Text',
                    state: {
                      text: 'Middle Content',
                    },
                  },
                ],
              },
              {
                id: 'title-right',
                type: 'TitleRight',
                children: [
                  {
                    id: 'right-text',
                    type: 'Text',
                    state: {
                      text: 'Right Content',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        // Check left section
        expect(screen.getByTestId('title-logo-logo')).toBeInTheDocument()
        expect(screen.getByAltText('Company Logo')).toBeInTheDocument()

        // Check middle section
        expect(screen.getByText('Middle Content')).toBeInTheDocument()

        // Check right section
        expect(screen.getByText('Right Content')).toBeInTheDocument()
      })
    })
  })

  describe('as is: TitleLogo with valid state', () => {
    describe('when: TitleLogo has src and alt in state (equivalence: valid state)', () => {
      it('to be: TitleLogo renders correctly, should display image with correct src and alt', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Test Logo',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const logo = screen.getByTestId('title-logo-logo')
        expect(logo).toBeInTheDocument()

        const logoImage = screen.getByAltText('Test Logo')
        expect(logoImage).toBeInTheDocument()
        expect(logoImage).toHaveAttribute('src', testLogoSvg)
      })
    })
  })

  describe('as is: TitleLogo with missing state', () => {
    describe('when: TitleLogo has no state (boundary: empty state)', () => {
      it('to be: TitleLogo does not render, should return null when state is missing', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo',
                    type: 'TitleLogo',
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        // TitleLogo should not render when state is missing
        expect(screen.queryByTestId('title-logo-logo')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with multiple TitleLogo components', () => {
    describe('when: TitleLeft contains multiple TitleLogo children', () => {
      it('to be: all TitleLogo components render correctly, should display all logos', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo-1',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Logo 1',
                    },
                  },
                  {
                    id: 'logo-2',
                    type: 'TitleLogo',
                    state: {
                      src: testLogoSvg,
                      alt: 'Logo 2',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByTestId('title-logo-logo-1')).toBeInTheDocument()
        expect(screen.getByTestId('title-logo-logo-2')).toBeInTheDocument()
        expect(screen.getByAltText('Logo 1')).toBeInTheDocument()
        expect(screen.getByAltText('Logo 2')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with nested structure', () => {
    describe('when: TitleLeft contains Div which contains TitleLogo', () => {
      it('to be: nested structure renders correctly, should display logo within nested Div', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-left',
                type: 'TitleLeft',
                children: [
                  {
                    id: 'logo-container',
                    type: 'Div',
                    attributes: {
                      className: 'flex items-center',
                    },
                    children: [
                      {
                        id: 'logo',
                        type: 'TitleLogo',
                        state: {
                          src: testLogoSvg,
                          alt: 'Nested Logo',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByTestId('title-logo-logo')).toBeInTheDocument()
        expect(screen.getByAltText('Nested Logo')).toBeInTheDocument()
      })
    })
  })

  describe('as is: Title with mixed content types', () => {
    describe('when: TitleRight contains Button and Text children', () => {
      it('to be: mixed content renders correctly, should display both Button and Text in right section', () => {
        const document: SduiLayoutDocument = {
          version: '1.0.0',
          root: {
            id: 'title-root',
            type: 'Title',
            children: [
              {
                id: 'title-right',
                type: 'TitleRight',
                children: [
                  {
                    id: 'button-1',
                    type: 'Button',
                    children: [
                      {
                        id: 'button-text-1',
                        type: 'Text',
                        state: {
                          text: 'Sign In',
                        },
                      },
                    ],
                  },
                  {
                    id: 'text-1',
                    type: 'Text',
                    state: {
                      text: 'Help',
                    },
                  },
                ],
              },
            ],
          },
        }

        renderWithSduiLayout(document, { components: sduiComponents })

        const title = screen.getByTestId('title-title-root')
        expect(title).toBeInTheDocument()

        expect(screen.getByText('Sign In')).toBeInTheDocument()
        expect(screen.getByText('Help')).toBeInTheDocument()
      })
    })
  })
})
