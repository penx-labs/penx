'use client'

import { Button } from '@penx/ui/components/button'
import { toast } from 'sonner'

export function AddCreationTypeButton() {
  return (
    <Button
      onClick={() => {
        toast.info('Coming soon! This feature is currently in development.')
      }}
    >
      Add
    </Button>
  )
}
