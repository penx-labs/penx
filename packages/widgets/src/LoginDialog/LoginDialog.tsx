'use client'

import { Trans } from '@lingui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@penx/uikit/dialog'
import { LoginDialogContent } from './LoginDialogContent'
import { PinCodeForm } from './PinCodeForm'
import { RegisterForm } from './RegisterForm'
import { useAuthStatus } from './useAuthStatus'
import { useLoginDialog } from './useLoginDialog'

interface Props {}

export function LoginDialog({}: Props) {
  const { isOpen, setIsOpen } = useLoginDialog()
  const { authStatus } = useAuthStatus()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="grid gap-4 sm:max-w-[425px]">
        {authStatus.type === 'login' && (
          <>
            <DialogHeader>
              <DialogTitle className="mb-4 text-center text-2xl">
                <Trans id="Welcome to PenX"></Trans>
              </DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <LoginDialogContent />
          </>
        )}

        {authStatus.type === 'register' && (
          <div className="h-[290px]">
            <DialogHeader>
              <DialogTitle className="mb-6 text-center text-2xl">
                <Trans id="Register to PenX"></Trans>
              </DialogTitle>
            </DialogHeader>
            <RegisterForm />
          </div>
        )}

        {authStatus.type === 'register-email-sent' && (
          <div className="flex h-full flex-col">
            <DialogHeader>
              <DialogTitle className="">
                <Trans id="Register to PenX"></Trans>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <PinCodeForm></PinCodeForm>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
