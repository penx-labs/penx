import { useState } from 'react'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { useQuerySite } from '@penx/hooks/useQuerySite'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { trpc } from '@penx/trpc-client'
import { toast } from 'sonner'

export default function AddCollaborator() {
  const [q, setQ] = useState('')
  const {site} = useQuerySite()
  const { refetch } = useCollaborators()
  const { mutateAsync, isPending } =
    trpc.collaborator.addCollaborator.useMutation()

  const add = async () => {
    if (!q.trim()) return toast.error('Please enter a valid address or email')
    try {
      await mutateAsync({ q, siteId: site.id })
      refetch()
      toast.success('Add collaborator successfully')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          placeholder="Enter wallet address or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button className="w-24" disabled={isPending || !q} onClick={add}>
          {isPending ? <LoadingDots /> : 'Add'}
        </Button>
      </div>
    </div>
  )
}
