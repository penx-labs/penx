'use client'

import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import { Image } from '@penx/components/Image'
import { PodcastTips } from '@penx/components/PodcastTips'
import { ContentRender } from '@penx/content-render'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Link } from '@penx/libs/i18n'
import { Creation } from '@penx/types'
import { getUrl } from '@penx/utils'

interface Props {
  podcasts: Creation[]
}

export function PodcastCard({ podcasts }: Props) {
  const site = useSiteContext()
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-xl font-bold">
          <Trans id="Podcasts"></Trans>
        </div>
        <Link
          href="/posts"
          className="text-brand hover:text-brand/80 dark:hover:text-brand/80"
        >
          <Trans id="All"></Trans> &rarr;
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
        {podcasts.slice(0, 2).map((post) => (
          <Link
            key={post.id}
            href={`/creations/${post.slug}`}
            className="flex items-center justify-between gap-1 transition-all hover:scale-105"
          >
            <div>
              <span className="hover:text-brand">{post.title}</span>
              <div className="flex items-center gap-1">
                <PodcastTips creation={post} showIcon={false} />
                <div className="text-xs">
                  {format(new Date(post.publishedAt!), 'yyyy-MM-dd')}
                </div>
              </div>
            </div>

            <Image
              alt=""
              width={200}
              height={200}
              className="size-12 rounded-xl"
              src={getUrl(post.image || site.logo || site.image || '')}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
