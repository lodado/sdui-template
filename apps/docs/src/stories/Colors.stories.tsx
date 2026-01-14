import type { Meta, StoryObj } from '@storybook/react-vite'

import { Colors } from './Colors'

const meta: Meta<typeof Colors> = {
  title: 'Design System/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

A comprehensive color palette extracted from the **Jira Design System**. This component automatically parses CSS custom properties (CSS variables) from the design system files and displays them in an organized, categorized grid.

## Features

- **Automatic parsing**: Extracts color variables from CSS files
- **Categorized display**: Colors grouped by logical categories
- **Complete information**: Each swatch shows variable name, CSS reference, and color value
- **Design system integration**: Based on Jira Design System specifications

## Categories

Colors are organized into the following categories:
- Background
- Text
- Border
- Icon
- Link
- Chart
- Interaction
- Skeleton
- Blanket

## Source

[View in Figma](https://www.figma.com/design/RXclnIXmr2835BdXOKBJDL/ADS-Foundations--Community-?node-id=14439-10399&p=f&t=i4NwiBe0wp852FUm-0)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Colors>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Displays the complete color palette organized by category, providing a visual reference for all available colors in the design system.

## Display Format

Each color is presented as a **swatch** containing:
- **Color name**: Human-readable identifier
- **CSS variable**: Reference like \`--color-background-default\`
- **Color value**: Actual hex/rgb value

## Organization

Colors are automatically:
- Extracted from design system CSS files
- Grouped into logical categories
- Sorted for easy reference

## Usage

Use this palette to:
- Find the right color for your design
- Reference CSS variable names in code
- Ensure consistency across the application
        `,
      },
    },
  },
}
