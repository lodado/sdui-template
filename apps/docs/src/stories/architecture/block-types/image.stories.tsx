import type { Meta, StoryObj } from '@storybook/react-vite'

import { BLOCK_TYPE_DOCS } from './blockRegistry'
import { blockTypeMeta, blockTypeStory } from './createBlockTypeStory'

const doc = BLOCK_TYPE_DOCS.find((entry) => entry.slug === 'Image')!

const meta: Meta = blockTypeMeta(doc)
export default meta

export const Image: StoryObj = blockTypeStory(doc)
