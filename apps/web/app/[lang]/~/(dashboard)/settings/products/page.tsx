'use client'

import { LoadingDots } from '@penx/uikit/loading-dots'
import { Button } from '@penx/uikit/button'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { useProductDialog } from './ProductDialog/useProductDialog'
import { ProductList } from './ProductList'
import { ProductPriceDialog } from './ProductPriceDialog/ProductPriceDialog'

export const dynamic = 'force-static'

export default function Page() {
  const { isLoading, site, error } = useQuerySite()
  const { setState } = useProductDialog()

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Products</div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setState({
              isOpen: true,
              product: null as any,
              index: -1,
            })
          }}
        >
          Create product
        </Button>
      </div>

      <ProductPriceDialog />
      <ProductList site={site} />
    </div>
  )
}
