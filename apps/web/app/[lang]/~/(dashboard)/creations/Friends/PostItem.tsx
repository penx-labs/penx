'use client'

import { useMemo } from 'react'
import { creationToFriend } from '@/lib/creationToFriend'
import { Trans } from '@lingui/react'
import { format } from 'date-fns'
import { Archive, ArrowUpRight, Edit3Icon } from 'lucide-react'
import { toast } from 'sonner'
import { CreationStatus, ROOT_DOMAIN } from '@penx/constants'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { refetchAreaCreations } from '@penx/hooks/useAreaCreations'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Link } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { api } from '@penx/trpc-client'
import { CreationType, Option, Prop, SiteCreation } from '@penx/types'
import { Badge } from '@penx/uikit/ui/badge'
import { Button } from '@penx/uikit/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@penx/uikit/ui/table'
import { cn, getUrl } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'

interface PostItemProps {
  creation: SiteCreation
}

export function PostItem({ creation }: PostItemProps) {
  const isPublished = creation.status === CreationStatus.PUBLISHED
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any, false)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  const postUrl = `${location.protocol}//${host}/creations/${creation.slug}`
  const friend = creationToFriend(creation)
  const props = creation.mold?.props as Prop[]

  const statusProp = props.find((p) => p.slug === 'status')
  const options = useMemo(() => {
    if (statusProp) return statusProp?.options as Option[]
    return []
  }, [statusProp])

  return (
    <TableRow key={creation.id}>
      <TableCell>
        <a
          target={isPublished ? '_blank' : '_self'}
          href={
            isPublished
              ? postUrl
              : `/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`
          }
          className="inline-flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="text-base font-bold">
            {creation.title || 'Untitled'}
          </div>
          {isPublished && creation.type === CreationType.ARTICLE && (
            <ArrowUpRight size={16} className="text-brand" />
          )}
        </a>
        <div className="text-foreground/60 text-sm">{friend.introduction}</div>
      </TableCell>
      <TableCell>
        <a href={friend.url} target="_blank">
          {friend.url}
        </a>
      </TableCell>
      <TableCell>{format(creation.createdAt, 'yyyy/MM/dd')}</TableCell>
      <TableCell className="flex gap-2">
        <Link
          href={`/~/post?id=${creation.id}&type=${creation.mold?.type || ''}`}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-50"
          >
            <Edit3Icon size={14}></Edit3Icon>
            <div>
              <Trans id="Edit"></Trans>
            </div>
          </Button>
        </Link>

        <ConfirmDialog
          title="Archive this post?"
          content="Are you sure you want to archive this post?"
          tooltipContent="Archive this post"
          onConfirm={async () => {
            await api.creation.archive.mutate(creation.id)
            await refetchAreaCreations()
          }}
        >
          <Button
            size="xs"
            variant="ghost"
            className="h-7 gap-1 rounded-full text-xs opacity-60"
          >
            <Archive size={14}></Archive>
            <div>Archive</div>
          </Button>
        </ConfirmDialog>

        <div className="w-40">
          <Select
            defaultValue={friend.status}
            onValueChange={async (v) => {
              toast.promise(
                async () => {
                  await api.creation.update.mutate({
                    id: creation.id,
                    props: {
                      ...(creation.props as any),
                      [statusProp!.id]: v,
                    },
                  })

                  await api.creation.publish.mutate({
                    siteId: site.id,
                    creationId: creation.id,
                    slug: creation.slug,
                  })
                },
                {
                  loading: 'Updating...',
                  success: 'Updated successfully!',
                  error: 'Failed to updated',
                },
              )
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={<Trans id="Select a status"></Trans>} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option, i) => (
                <SelectItem key={i} value={option.name}>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn('size-5 rounded', `bg-${option.color}-500`)}
                    ></div>
                    <div>{option.name}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  )
}
