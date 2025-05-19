import { WidgetType } from '@penx/constants'
import { Widget } from '@penx/types'
import { AIChatHistorys } from './widgets/AIChatHistorys'
import { AllCreations } from './widgets/AllCreations'
import { AllStructs } from './widgets/AllStructs'
import { CreationList } from './widgets/CreationList'
import { Favorites } from './widgets/Favorites'
import { RecentlyEdited } from './widgets/RecentlyEdited'
import { RecentlyOpened } from './widgets/RecentlyOpened'
import { StructList } from './widgets/StructList'

interface Props {
  widget: Widget
}
export function WidgetRender({ widget }: Props) {
  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <RecentlyEdited />
  }

  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <RecentlyOpened />
  }

  if (widget.type === WidgetType.FAVORITES) {
    return <Favorites />
  }

  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <AllCreations />
  }

  // if (widget.type === WidgetType.ALL_STRUCTS) {
  //   return <AllStructs />
  // }

  if (widget.type === WidgetType.STRUCT) {
    return <CreationList widget={widget} />
  }

  if (widget.type === WidgetType.AI_CHAT) {
    return <AIChatHistorys />
  }

  return null
}
