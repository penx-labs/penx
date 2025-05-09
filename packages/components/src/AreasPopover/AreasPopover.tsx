'use client'

import { Trans } from '@lingui/react'
import { PopoverClose } from '@radix-ui/react-popover'
import { ChevronDown, ChevronsUpDown, HomeIcon, PlusIcon } from 'lucide-react'
import { ProfileAvatar } from '@penx/components/ProfileAvatar'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { updateSession, useSession } from '@penx/session'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { MenuItem } from '@penx/uikit/menu'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { useAreaDialog } from '../AreaDialog/useAreaDialog'

interface Props {
  className?: string
}

export const AreasPopover = ({ className = '' }: Props) => {
  const { setIsOpen } = useAreaDialog()
  const { areas = [] } = useAreas()
  const { area } = useArea()

  if (!area) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="hover:bg-foreground/5 group/area flex h-10 w-full cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors">
          <div className="flex flex-1 cursor-pointer items-center gap-1">
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUrl(area?.logo || '')} alt="" />
                <AvatarFallback
                  className={cn(generateGradient(area.name))}
                ></AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{area?.name}</span>
              </div>
            </div>
            <ChevronsUpDown className="size-3" />
          </div>
          <Button
            variant="ghost"
            className="hover:bg-foreground/7 text-foreground/80 hidden size-7 rounded-md group-hover/area:flex"
            size="icon"
            onClick={async (e) => {
              e.stopPropagation()
              e.preventDefault()
              await store.panels.resetPanels()
            }}
          >
            <HomeIcon size={18} className="text-foreground/60" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        {areas.map((item) => (
          <PopoverClose key={item.id} asChild>
            <MenuItem
              className="flex cursor-pointer items-center gap-2"
              onClick={async () => {
                store.area.set(item)
                store.creations.refetchCreations(item.id)
                store.visit.setAndSave({ activeAreaId: item.id })
                store.panels.resetPanels()
              }}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={getUrl(item.logo!)} alt="" />
                <AvatarFallback
                  className={cn(generateGradient(item.name))}
                ></AvatarFallback>
              </Avatar>
              <div>{item.name}</div>
            </MenuItem>
          </PopoverClose>
        ))}

        <PopoverClose asChild>
          <MenuItem
            className="flex cursor-pointer items-center gap-2"
            onClick={async () => {
              setIsOpen(true)
            }}
          >
            <PlusIcon size={16} />
            <div>
              <Trans id="Create area"></Trans>
            </div>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
