'use client'

import { useEffect, useRef, useState } from 'react'
import { FullPageDatabase } from '@/components/database-ui'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { useSite } from '@/hooks/useSite'
import { FRIEND_DATABASE_NAME } from '@penx/constants'
import { api } from '@penx/trpc-client'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWith] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    setWith(ref.current!.getBoundingClientRect().width)
  }, [ref])

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return (
    <div ref={ref} className="w-full">
      <div className="border-foreground/5 border-b" style={{ width }}>
        <FullPageDatabase
          slug={FRIEND_DATABASE_NAME}
          fetcher={async () => {
            return await api.database.getOrCreateFriendsDatabase.mutate({
              siteId: site.id,
            })
          }}
        />
      </div>
    </div>
  )
}
