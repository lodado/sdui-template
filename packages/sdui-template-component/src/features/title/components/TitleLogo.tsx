'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'
import Image from 'next/image'

import { logoStateSchema } from '../types'

interface TitleLogoProps {
  id: string
  parentPath?: string[]
}

export const TitleLogo = ({ id, parentPath = [] }: TitleLogoProps) => {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: logoStateSchema,
  })

  if (!state) {
    return null
  }

  return (
    <div className="relative shrink-0 flex items-center h-full" data-node-id={id} data-testid={`title-logo-${id}`}>
      <Image
        src={state.src}
        alt={state.alt}
        width={156}
        height={32}
        className="h-[20px] w-auto"
        style={{ width: 'auto', height: '20px' }}
      />
    </div>
  )
}
