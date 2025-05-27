'use client'

import { Trans } from '@lingui/react/macro'
import { Search } from 'lucide-react'
import { Kbd } from '@penx/components/Kbd'
import { useOpen } from '../CommandPanel/hooks/useOpen'

interface Props {}

export const QuickSearchTrigger = ({}: Props) => {
  const { setOpen } = useOpen()
  return (
    <div className="flex-1">
      <div
        className="bg-background shadow-xs dark:bg-foreground/8 flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-all hover:shadow-md"
        onClick={() => {
          setOpen(true)
        }}
      >
        <div className="flex items-center gap-1">
          <Search size={18} className="text-foreground/40" />
          <span className="text-foreground/40 text-sm">
            <Trans>Search</Trans>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Kbd className="bg-foreground/10">⌘</Kbd>
          <Kbd className="bg-foreground/10">k</Kbd>
        </div>
      </div>
    </div>
  )
}
