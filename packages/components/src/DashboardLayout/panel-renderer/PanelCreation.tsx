'use client'

import { CreationStatus } from '@prisma/client'
import { Creation } from '@penx/components/Creation/Creation'
import { CreationMoreMenu } from '@penx/components/Creation/CreationMoreMenu'
import {
  PanelCreationProvider,
  usePanelCreationContext,
} from '@penx/components/Creation/PanelCreationProvider'
import { PublishDialog } from '@penx/components/Creation/PublishDialog/PublishDialog'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Panel } from '@penx/types'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'
import { CreationLink } from './CreationLink'

interface Props {
  panel: Panel
  index: number
}

export function PanelCreation(props: Props) {
  return (
    <PanelCreationProvider
      panel={props.panel}
      creationId={props.panel?.creationId!}
    >
      <Content {...props}></Content>
    </PanelCreationProvider>
  )
}

export function Content({ panel, index }: Props) {
  const creation = usePanelCreationContext()

  return (
    <>
      <PublishDialog />
      <PanelHeaderWrapper index={index}>
        <div className="line-clamp-1 text-sm">{creation?.title}</div>
        <div className="flex items-center gap-1">
          {/* {creation?.status === CreationStatus.PUBLISHED && <AreaLink />} */}
          <CreationMoreMenu creation={creation} />
          <ClosePanelButton panel={panel} />
        </div>
      </PanelHeaderWrapper>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
        <Creation index={index} />
      </div>
    </>
  )
}
