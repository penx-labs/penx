'use client'

import { useSiteContext } from '@penx/contexts/SiteContext'
import { Button } from '@penx/uikit/button'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { LayoutItem } from '@penx/types'
import { trpc } from '@penx/trpc-client'
import { produce } from 'immer'
import { Trash2 } from 'lucide-react'
import { useThemeName } from '../hooks/useThemeName'
import { useDesignContext } from './hooks/DesignContext'
import { getDisableDragProps } from './lib/getDisableDragProps'

export function DeleteCardButton({ item }: { item: LayoutItem }) {
  const { layout, setLayout } = useDesignContext()
  const { refetch } = useQuerySite()
  const site = useSiteContext()
  const { themeName } = useThemeName()
  const themeConfig = (site.themeConfig || {}) as Record<string, any>
  const { mutateAsync } = trpc.site.updateSite.useMutation()

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute -left-2 -top-2 z-50 hidden size-8 border-none shadow group-hover:flex"
      onClick={async () => {
        const newLayout = layout.filter((i) => i.i !== item.i)
        setLayout(newLayout)
        const newThemeConfig = produce(themeConfig, (draft) => {
          if (!draft?.[themeName]) draft[themeName] = {}
          draft[themeName].layout = newLayout
        })

        await mutateAsync({
          id: site.id,
          themeConfig: newThemeConfig,
        })
        refetch()
      }}
      {...getDisableDragProps()}
    >
      <Trash2 size={16} />
    </Button>
  )
}
