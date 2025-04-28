'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSite } from '@penx/hooks/useSite'
import { SeoSettingForm } from './SeoSettingForm'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useSite()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }
  return <SeoSettingForm site={site!} />
}
