'use client'

import { Trans } from '@lingui/react'
import { Button } from '@penx/uikit/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@penx/uikit/ui/dialog'
import { AreaForm } from './AreaForm'
import { useAreaDialog } from './useAreaDialog'

export function AreaDialog() {
  const { isOpen, setIsOpen, area: field } = useAreaDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogHeader className="hidden">
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {!!field ? (
              <Trans id="Update field"></Trans>
            ) : (
              <Trans id="Create field"></Trans>
            )}
          </DialogTitle>
        </DialogHeader>
        <AreaForm />
      </DialogContent>
    </Dialog>
  )
}
