'use client'

import { Mold } from '@prisma/client'
import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { useTagsContext } from '@penx/contexts/TagsContext'
import { useCreations } from '@penx/hooks/useCreations'
import { getTextColorByName } from '@penx/libs/color-helper'
import { Panel } from '@penx/types'
import { cn } from '@penx/utils'
import { BookmarkItem } from './BookmarkItem'

interface Props {
  mold: Mold
  panel: Panel
  index: number
}

export function BookmarkList(props: Props) {
  const data = useAreaCreationsContext()
  const site = useSiteContext()
  const tags = useTagsContext()
  const creations = data.filter((item) => item.moldId === props.mold.id)

  return (
    <div className="flex w-full flex-col gap-2">
      {tags.map((tag) => {
        // const tagCreations = creations.filter((item) => {
        //   return item.creationTags.some((t) => t.tagId === tag.id)
        // })

        // if (!tagCreations.length) return null

        return (
          <div key={tag.id} className="mb-6 py-2">
            <div
              className={cn('mb-2 font-bold', getTextColorByName(tag.color))}
            >
              {tag.name}
            </div>
            <div className="">
              {/* {tagCreations.map((post) => {
                return (
                  <BookmarkItem
                    key={post.id}
                    creation={post as any}
                    {...props}
                  />
                )
              })} */}
            </div>
          </div>
        )
      })}
    </div>
  )
}
