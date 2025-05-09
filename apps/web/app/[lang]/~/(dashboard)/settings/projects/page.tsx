'use client'

import { useEffect, useRef, useState } from 'react'
import { FullPageDatabase } from '@penx/components/database-ui'
import { PROJECT_DATABASE_NAME } from '@penx/constants'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { api, trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/loading-dots'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useQuerySite()
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
        {width > 0 && (
          <FullPageDatabase
            slug={PROJECT_DATABASE_NAME}
            fetcher={async () => {
              const database =
                await api.database.getOrCreateProjectsDatabase.mutate({
                  siteId: site.id,
                })
              return database
            }}
          />
        )}
      </div>
    </div>
  )
}
