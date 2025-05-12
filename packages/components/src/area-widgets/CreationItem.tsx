import { Trans } from '@lingui/react'
import {
  BookmarkIcon,
  FileTextIcon,
  PanelLeft,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from 'lucide-react'
import { Node } from 'slate'
import { isMobileApp } from '@penx/constants'
import { CreationStatus } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { updateCreation } from '@penx/hooks/useCreation'
import { creationIdAtom, useCreationId } from '@penx/hooks/useCreationId'
import { useCreationMold } from '@penx/hooks/useCreationMold'
import { usePanels } from '@penx/hooks/usePanels'
import { ICreation } from '@penx/model-type/ICreation'
import { store } from '@penx/store'
import { CreationType, PanelType, SiteCreation } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@penx/uikit/context-menu'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'
import { useIsAllContext } from './IsAllContext'

interface CreationItemProps {
  creation: ICreation
}

export function CreationItem({ creation }: CreationItemProps) {
  const { isCreationInPanels } = usePanels()
  const { isAll, setVisible } = useIsAllContext()
  const mold = useCreationMold(creation)

  const getTitleFromContent = () => {
    try {
      const json: any[] = JSON.parse(creation.content)
      const title = json.map((item) => Node.string(item)).join(', ')
      return title.slice(0, 30)
    } catch (error) {
      return ''
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          key={creation.id}
          className="hover:bg-foreground/5 group flex h-7 cursor-pointer items-center gap-2 rounded py-1 pl-2 pr-1 transition-all"
          onClick={() => {
            if (isMobileApp) {
              appEmitter.emit('ROUTE_TO_CREATION', creation)
              store.set(creationIdAtom, creation.id)
              setVisible?.(false)
              return
            }

            store.panels.updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
            })
          }}
        >
          {[CreationType.PAGE, CreationType.NOTE].includes(
            mold?.type as CreationType,
          ) && <FileTextIcon size={16} className="text-foreground/60" />}

          {[CreationType.BOOKMARK].includes(mold?.type as CreationType) && (
            <BookmarkIcon size={16} className="text-foreground/60" />
          )}

          {mold?.type === CreationType.TASK && (
            <Checkbox
              onClick={(e) => e.stopPropagation()}
              checked={creation.checked}
              onCheckedChange={(v) => {
                updateCreation({
                  id: creation.id,
                  checked: v as any,
                })
              }}
            />
          )}
          <div
            className={cn(
              'text-foreground/80 line-clamp-1 flex-1 text-sm',
              isMobileApp && 'text-base',
            )}
          >
            {creation.title || getTitleFromContent() || 'Untitled'}
          </div>
          {isAll && creation.status === CreationStatus.PUBLISHED && (
            <div className="size-1 rounded-full bg-green-500 text-xs opacity-50"></div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            store.panels.addPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
            })
          }}
        >
          <PanelLeft size={16} />
          <span>
            <Trans id="Open in new panel"></Trans>
          </span>
        </ContextMenuItem>
        <ToggleFavorite creation={creation} />

        <ContextMenuItem disabled>
          <TrashIcon size={16} />
          <span>
            <Trans id="Delete"></Trans>
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function ToggleFavorite({ creation }: CreationItemProps) {
  const { area } = useArea()
  const isFavor = area.favorites?.includes(creation.id)
  return (
    <ContextMenuItem
      onClick={async () => {
        if (isFavor) {
          await store.area.removeFromFavorites(creation.id)
        } else {
          await store.area.addToFavorites(creation.id)
        }
      }}
    >
      {isFavor && <StarOffIcon size={16} />}
      {!isFavor && <StarIcon size={16} />}

      <span>
        {isFavor ? (
          <Trans id="Remove from favorites"></Trans>
        ) : (
          <Trans id="Add to favorites"></Trans>
        )}
      </span>
    </ContextMenuItem>
  )
}
