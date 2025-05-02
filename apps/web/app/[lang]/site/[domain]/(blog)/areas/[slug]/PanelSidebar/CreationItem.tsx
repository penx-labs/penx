'use client'

import { Trans } from '@lingui/react'
import { useArea } from '@penx/hooks/useArea'
import { Link } from '@penx/libs/i18n'
import { ICreation } from '@penx/model-type/ICreation'

interface CreationItemProps {
  creation: ICreation
}

export function CreationItem({ creation }: CreationItemProps) {
  const { area } = useArea()
  return (
    <Link
      href={`/areas/${area.slug}/${creation.slug}`}
      className="hover:bg-foreground/5 group flex h-7 cursor-pointer items-center gap-2 rounded py-1 pl-2 pr-1 transition-all"
    >
      <div className="line-clamp-1 flex-1 text-sm">
        {creation.title || 'Untitled'}
      </div>
    </Link>
  )
}
