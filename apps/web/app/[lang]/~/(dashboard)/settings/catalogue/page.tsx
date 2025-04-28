'use client'

import { useAreaCreationsContext } from '@penx/contexts/AreaCreationsContext'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { usePages } from '@penx/hooks/usePages'
import { useSite } from '@penx/hooks/useSite'
import { CatalogueBox } from './CatalogueBox/CatalogueBox'

export const dynamic = 'force-static'

export default function Page() {
  const creations = useAreaCreationsContext()
  const pages = usePages()

  if (pages.isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="border-foreground/10 mx-auto w-full rounded-lg border px-1">
      <CatalogueBox />
    </div>
  )
}
