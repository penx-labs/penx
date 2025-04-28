'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { useSite } from '@penx/hooks/useSite'
import { trpc } from '@penx/trpc-client'
import { I18nSettingForm } from './I18nSettingForm'

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
  return (
    <div>
      <I18nSettingForm site={site!} />
    </div>
  )
}
