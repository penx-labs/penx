'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { nextTick } from 'process'
import { Shape, ShapeStream } from '@electric-sql/client'
import { useQuery } from '@tanstack/react-query'
import { editorDefaultValue } from '@penx/constants'
import { useCreations } from '@penx/hooks/useCreations'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/button'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@penx/uikit/sidebar'
import { uniqueId } from '@penx/unique-id'
import { AppSidebar } from '../Sidebar/app-sidebar'
import { PanelList } from './PanelList'

export function PanelLayout({ children }: { children: ReactNode }) {
  // useSiteTags()
  return (
    <SidebarProvider className="">
      <AppSidebar />
      <SidebarInset className="relative">
        <PanelList />
      </SidebarInset>
    </SidebarProvider>
  )
}
