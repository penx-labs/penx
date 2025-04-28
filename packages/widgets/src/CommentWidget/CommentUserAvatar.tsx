'use client'

import { Comment, User } from '@penx/db/client'
import { ArrowUpRight } from 'lucide-react'
import { ROOT_DOMAIN } from '@penx/constants'
import {
  getSiteCustomDomain,
  getSiteCustomSubdomain,
  sortDomains,
} from '@penx/libs/getSiteDomain'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@penx/uikit/hover-card'
import { getUrl } from '@penx/utils'
import { UserAvatar } from '../UserAvatar'

interface Props {
  user: User
}

export function CommentUserAvatar({ user }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="inline-flex cursor-pointer">
          <UserAvatar
            address={user.email as string}
            image={getUrl(user.image || '')}
            className="h-8 w-8"
          />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <Content user={user} />
      </HoverCardContent>
    </HoverCard>
  )
}

function Content({ user }: Props) {
  const { isLoading, data } = trpc.user.byId.useQuery(user.id)
  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }

  const customDomain = getSiteCustomDomain(data?.sites?.[0]?.domains||[])
  const customSubdomain = getSiteCustomSubdomain(data?.sites?.[0]?.domains||[])

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={getUrl(data?.image || '')} />
        <AvatarFallback>{data?.displayName?.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">
          {data?.displayName || data?.name}
        </h4>
        <p className="text-sm">{data?.bio || data?.sites[0]?.description}</p>
        <div className="flex flex-col items-center gap-1 pt-2">
          {customDomain && (
            <a
              href={`${location.protocol}//${customDomain}`}
              target="_blank"
              className="text-foreground/60 flex gap-0.5 text-sm"
            >
              <span>{`${customDomain}`}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </a>
          )}
          {customSubdomain && (
            <a
              href={`${location.protocol}//${customSubdomain.domain}.${ROOT_DOMAIN}`}
              target="_blank"
              className="text-foreground/60 flex gap-0.5 text-sm"
            >
              <span>{`${customSubdomain.domain}.${ROOT_DOMAIN}`}</span>
              <ArrowUpRight size={16} className="text-foreground/60" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
