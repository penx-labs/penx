'use client'

import React, { forwardRef, useState } from 'react'
import { DraggableSyntheticListeners } from '@dnd-kit/core'
import { Trans } from '@lingui/react'
import { arrayMoveImmutable } from 'array-move'
import { produce } from 'immer'
import { ArrowDown, ArrowUp, Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { defaultNavLinks } from '@penx/constants'
import { updateSiteState, useQuerySite } from '@penx/hooks/useQuerySite'
import { api } from '@penx/trpc-client'
import { NavLink, NavLinkLocation, NavLinkType } from '@penx/types'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { useNavLinkDialog } from './NavLinkDialog/useNavLinkDialog'

interface Props {
  dragging?: boolean
  dragOverlay?: boolean
  isDragging?: boolean
  isSorting?: boolean

  /** for drag handle */
  listeners?: DraggableSyntheticListeners

  /** for drag handle */
  attributes?: any

  id: string

  index: number

  style?: any

  navLink: NavLink
}

export const Item = forwardRef<HTMLDivElement, Props>(
  function Item(props, ref) {
    const {
      navLink: item,
      index,
      id,
      dragOverlay,
      isDragging,
      isSorting,
      attributes,
      listeners,
      ...rest
    } = props
    const { setState } = useNavLinkDialog()
    const { site } = useQuerySite()
    let navLinks = (site.navLinks || defaultNavLinks) as NavLink[]

    const [visible, setVisible] = useState(item.visible)

    async function toggleVisible() {
      const newLinks = produce(navLinks, (draft) => {
        draft[index]!.visible = !draft[index]!.visible
      })

      updateSiteState({ navLinks: newLinks })

      setVisible(!visible)
      try {
        await api.site.updateSite.mutate({
          id: site.id,
          navLinks: newLinks,
        })
        // await refetch()
        toast.success('Visible status updated successfully!')
      } catch (error) {
        toast.error(extractErrorMessage(error))
      }
    }

    if (!item) return null

    return (
      <div
        ref={ref}
        className={cn(
          'bg-background group/widget flex rounded-xl py-2',
          isDragging && 'bg-foreground/6 opacity-50',
          dragOverlay && 'z-[1000000] shadow',
        )}
        {...rest}
      >
        <div
          className="relative flex flex-1 cursor-pointer items-center gap-0 p-0"
          {...attributes}
          {...listeners}
        >
          <span className="icon-[clarity--drag-handle-line] size-7"></span>
          <div className="ont-semibold">{item.title}</div>
        </div>

        <div className="flex-1">
          {item.type === NavLinkType.PAGE && <Trans id="Header"></Trans>}
          {item.type === NavLinkType.BUILTIN && <Trans id="Builtin"></Trans>}
          {item.type === NavLinkType.TAG && <Trans id="Tag"></Trans>}
          {item.type === NavLinkType.CUSTOM && <Trans id="Custom"></Trans>}
        </div>
        <div className="flex-1">
          {item.location === NavLinkLocation.HEADER && (
            <Trans id="Header"></Trans>
          )}
          {item.location === NavLinkLocation.FOOTER && (
            <Trans id="Footer"></Trans>
          )}
        </div>
        <div className="flex-1">{item.pathname}</div>
        <div className="flex flex-1 items-center gap-1">
          {visible ? (
            <Eye size={16} className="cursor-pointer" onClick={toggleVisible} />
          ) : (
            <EyeOff
              size={16}
              className="cursor-pointer"
              onClick={toggleVisible}
            />
          )}

          <Edit3
            size={16}
            className="cursor-pointer"
            onClick={() => {
              setState({
                isOpen: true,
                navLink: item,
                index,
              })
            }}
          />

          {item.type !== NavLinkType.BUILTIN && (
            <ConfirmDialog
              title="Delete navigation"
              content="Are you sure you want to delete this navigation?"
              tooltipContent="Delete navigation"
              onConfirm={async () => {
                const newLinks = produce(navLinks, (draft) => {
                  draft.splice(index, 1)
                })
                updateSiteState({ navLinks: newLinks })
                await api.site.updateSite.mutate({
                  id: site.id,
                  navLinks: newLinks,
                })
                toast.success('Navigation deleted successfully!')
              }}
            />
          )}
        </div>
      </div>
    )
  },
)
