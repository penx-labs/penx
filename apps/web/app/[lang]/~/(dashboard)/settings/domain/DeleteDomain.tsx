'use client'

import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { Button } from '@penx/uikit/button'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { api } from '@penx/trpc-client'

export default function DeleteDomain({ domain }: { domain: string }) {
  const { refetch } = useQuerySite()
  return (
    <div>
      <ConfirmDialog
        title="Unbind domain?"
        content="Are you sure you want to unbind this domain?"
        onConfirm={async () => {
          // alert(domain)
          await api.site.deleteDomain.mutate({ domain })
          await refetch()
        }}
      >
        <Button variant="destructive">Unbind domain</Button>
      </ConfirmDialog>
    </div>
  )
}
