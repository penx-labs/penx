'use client'

import { createContext, PropsWithChildren, useContext, useEffect } from 'react'
import { STATIC_URL } from '@penx/constants'
import { Area, Channel, Struct, Site, Tag } from '@penx/db/client'

type SiteType = Site & {
  channels: Channel[]
  structs: Struct[]
  areas: Area[]
  tags: Tag[]
}

interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}

export const SiteContext = createContext({} as SiteType)

interface Props {
  site: SiteType
}

export const SiteProvider = ({ site, children }: PropsWithChildren<Props>) => {
  // useEffect(() => {
  //   window.__SITE__ = site
  // }, [site])
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSiteContext() {
  const site = useContext(SiteContext)
  function formatLogo() {
    if (!site.logo) return ''
    if (site.logo.startsWith('/')) {
      return `${STATIC_URL}${site.logo}`
    }
    return site.logo
  }

  return {
    ...site,
    logo: formatLogo(),
  }
}
