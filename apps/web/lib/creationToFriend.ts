import { IMoldNode } from '@penx/model-type'
import { SiteCreation } from '@penx/types'
import { Creation, Friend, Prop } from './theme.types'

export function creationToFriend(
  creation: Creation | SiteCreation,
  mold: IMoldNode,
): Friend {
  const props = (mold?.props.props || []) as Prop[]
  const output = props.reduce(
    (acc, prop) => {
      return { ...acc, [prop.slug]: creation.props?.[prop.id] }
    },
    {} as Record<string, any>,
  )

  return {
    id: creation.id,
    name: creation.title,
    introduction: creation.description,
    ...output,
  } as Friend
}
