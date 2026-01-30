'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'

import { gridLayoutDocument } from '../lib/sdui-document'
import { sduiComponents } from './sdui-components'

const GridLayoutSdui = () => {
  return <SduiLayoutRenderer document={gridLayoutDocument} components={sduiComponents} />
}

export default GridLayoutSdui
