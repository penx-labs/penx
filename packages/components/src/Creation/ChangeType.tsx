'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { useMoldsContext } from '@penx/contexts/MoldsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { updateCreation, updateCreationState } from '@penx/hooks/useCreation'
import { getCreationIcon } from '@penx/libs/getCreationIcon'
import { getMoldName } from '@penx/libs/getMoldName'
import { ICreation } from '@penx/model/ICreation'
import { api } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'

export function ChangeType({ creation }: { creation: ICreation }) {
  const molds = useMoldsContext()
  const [open, setOpen] = useState(false)
  const mold = molds.find((m) => m.id === creation.moldId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="xs"
          variant="ghost"
          className="text-foreground/60 -ml-2 h-7 gap-1 rounded-full px-2 text-xs"
        >
          {getMoldName(mold!)}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-2">
        <div className="mb-1 pl-2 text-sm font-semibold">
          <Trans id="Change type"></Trans>
        </div>
        {molds.map((mold) => {
          const name = getMoldName(mold)
          return (
            <Item
              key={mold.id}
              className="flex gap-2"
              onClick={async () => {
                setOpen(false)
                updateCreation({
                  id: creation.id,
                  type: mold.type,
                  moldId: mold.id,
                })
              }}
            >
              {getCreationIcon(mold.type)}
              <span>{name}</span>
            </Item>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
interface ItemProps {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
  className?: string
  onClick?: () => Promise<void>
}

function Item({
  children,
  isLoading,
  onClick,
  disabled,
  className,
}: ItemProps) {
  return (
    <div
      className={cn(
        'hover:bg-accent flex h-9 cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm',
        disabled && 'cursor-not-allowed opacity-40 hover:bg-none',
        className,
      )}
      onClick={() => {
        if (disabled) return
        onClick?.()
      }}
    >
      {children}
      {isLoading && <LoadingDots className="bg-foreground/60" />}
    </div>
  )
}
