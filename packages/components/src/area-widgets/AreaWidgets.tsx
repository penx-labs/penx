'use client'

import { Trans } from '@lingui/react'
import { AddCreationButton } from '@penx/components/AddCreationButton'
import { isMobileApp } from '@penx/constants'
import { AddWidgetButton } from './AddWidgetButton'
import { EditWidgetButton } from './EditWidget/EditWidgetButton'
import { MobileWidgetList } from './MobileWidgetList'
import { WidgetList } from './WidgetList'

interface Props {}

export function AreaWidgets({}: Props) {
  return (
    <>
      {!isMobileApp && (
        <div className="mb-1 flex items-center justify-between px-2">
          <div className="text-foreground/50 text-xs">
            <Trans id="Creations"></Trans>
          </div>
          <AddCreationButton></AddCreationButton>
        </div>
      )}
      <div className="space-y-2">
        {isMobileApp && <MobileWidgetList />}
        {!isMobileApp && <WidgetList />}

        {isMobileApp && (
          <div className="flex w-full justify-center">
            <EditWidgetButton />
          </div>
        )}
        {!isMobileApp && <AddWidgetButton />}
      </div>
    </>
  )
}
