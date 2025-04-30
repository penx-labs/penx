'use client'

import React from 'react'
import { PlusIcon } from 'lucide-react'
import { useMolds } from '@penx/hooks/useMolds'
import { Area } from '@penx/db/client'
import { useAddCreation } from '@penx/hooks/useAddCreation'
import { IArea } from '@penx/model-type/IArea'
import { Widget } from '@penx/types'
import { Button } from '@penx/uikit/button'

interface Props {
  area: IArea
  widget: Widget
}

export function AddCreationButton({ area, widget }: Props) {
  const { molds } = useMolds()
  const addCreation = useAddCreation()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="inline-flex size-6 items-center justify-center rounded-md p-0"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={async (e) => {
        e.stopPropagation()
        e.preventDefault()
        const mold = molds.find((mold) => mold.id === widget.moldId)!
        addCreation(mold.type)
      }}
    >
      <PlusIcon className="text-muted-foreground pointer-events-none size-4 transition-transform duration-200" />
    </Button>
  )
}
