'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
// import { runWorker } from '@/lib/worker'
import { Site } from '@penx/db/client'
import { useSearchParams } from 'next/navigation'
import { AreaProvider } from '@penx/components/AreaContext'
import { AreaDialog } from '@penx/components/AreaDialog'
import { CommandPanel } from '@penx/components/CommandPanel'
import { isBrowser, isServer, SIDEBAR_WIDTH } from '@penx/constants'
import { AreaCreationsProvider } from '@penx/contexts/AreaCreationsContext'
import { CreationTagsProvider } from '@penx/contexts/CreationTagsContext'
import { MoldsProvider } from '@penx/contexts/MoldsContext'
import { SiteProvider } from '@penx/contexts/SiteContext'
import { TagsProvider } from '@penx/contexts/TagsContext'
import { useArea } from '@penx/hooks/useArea'
import { useCreations } from '@penx/hooks/useCreations'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { useDomains } from '@penx/hooks/useDomains'
import { useMolds } from '@penx/hooks/useMolds'
import { useMySite } from '@penx/hooks/useMySite'
import { useSite } from '@penx/hooks/useSite'
import { useTags } from '@penx/hooks/useTags'
import { usePathname } from '@penx/libs/i18n'
import { useSession } from '@penx/session'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { cn } from '@penx/utils'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelLayout } from './PanelLayout'
import { PanelList } from './PanelList'
import { SettingsLayout } from './SettingsLayout'

// let inited = false
// if (!isServer) {
//   setTimeout(() => {
//     if (inited) return
//     inited = true
//     runWorker()
//   }, 2000)
// }

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const siteQuery = useMySite()
  const moldsQuery = useMolds()
  const tagsQuery = useTags()
  const creationTagsQuery = useCreationTags()
  const areaQuery = useArea()
  const areaCreationsQuery = useCreations()
  const domainsQuery = useDomains()

  const pathname = usePathname()!
  const isSettings = pathname.includes('/~/settings')
  const isDesign = pathname.includes('/~/design')

  if (
    siteQuery.isLoading ||
    domainsQuery.isLoading ||
    areaQuery.isLoading ||
    areaCreationsQuery.isLoading ||
    tagsQuery.isLoading ||
    moldsQuery.isLoading ||
    creationTagsQuery.isLoading
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingDots className="bg-foreground/60"></LoadingDots>
      </div>
    )
  }

  const Layout = isSettings ? SettingsLayout : PanelLayout
  // const Layout = PanelLayout

  // if (!areaCreations.data?.length) return null
  // if (!session) return null

  return (
    <SiteProvider site={siteQuery.data as any}>
      <MoldsProvider molds={moldsQuery.data!}>
        <TagsProvider tags={tagsQuery.data!}>
          <CreationTagsProvider creationTags={creationTagsQuery.data!}>
            <AreaProvider area={areaQuery.data!}>
              <AreaCreationsProvider
                creations={(areaCreationsQuery.data! as any) || []}
              >
                {/* <CommandPanel /> */}
                <AreaDialog />
                {isDesign && children}
                {!isDesign && <Layout>{children}</Layout>}
              </AreaCreationsProvider>
            </AreaProvider>
          </CreationTagsProvider>
        </TagsProvider>
      </MoldsProvider>
    </SiteProvider>
  )
}
